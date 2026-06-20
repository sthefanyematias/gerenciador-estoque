
import { Component } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ProdutosService } from '../../core/services/produtos.service';
import { NotificationService } from '../../core/services/notification.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Movimentacao } from '../../core/types/types';

@Component({
  selector: 'app-movimentacao-estoque',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './movimentacao-estoque.html',
  styleUrl: './movimentacao-estoque.css',
})
export class MovimentacaoEstoque {
  produtoIdInput: string = '';
  quantidade: number | null = null;
  tipoMovimentacao: 'Entrada' | 'Baixa' = 'Entrada';
  motivoBaixa: string = '';
  ultimaMovimentacao: Movimentacao | null = null;

  constructor(
    private produtosService: ProdutosService,
    private notificationService: NotificationService
  ) {}

  realizarMovimentacao(): void {
    const produtoIdNumber = Number(this.produtoIdInput);

    if (!this.produtoIdInput || isNaN(produtoIdNumber) || !this.quantidade || this.quantidade <= 0) {
      this.notificationService.mostrarAviso('Erro de Entrada', 'Verifique se o ID é numérico e a quantidade é positiva.');
      return;
    }

    if (this.tipoMovimentacao === 'Baixa' && !this.motivoBaixa.trim()) {
      this.notificationService.mostrarAviso('Campo Obrigatório', 'Informe o motivo da baixa antes de continuar.');
      return;
    }

    this.produtosService.buscarPorId(produtoIdNumber).pipe(
      switchMap(produtoAtual => {
        if (!produtoAtual) {
          return throwError(() => new Error('Produto não encontrado! Verifique o ID.'));
        }

        let novaQtde: number;

        if (this.tipoMovimentacao === 'Entrada') {
          novaQtde = produtoAtual.quantidade + this.quantidade!;
        } else {
          novaQtde = produtoAtual.quantidade - this.quantidade!;
          if (novaQtde < 0) {
            return throwError(() => new Error('Estoque insuficiente! Você tentou baixar mais do que existe em estoque.'));
          }
        }

        const movimentacao: Omit<Movimentacao, 'id'> = {
          produtoId: produtoIdNumber,
          produtoNome: produtoAtual.nome,
          tipo: this.tipoMovimentacao,
          quantidade: this.quantidade!,
          motivo: this.tipoMovimentacao === 'Baixa' ? this.motivoBaixa.trim() : null,
          data: new Date().toISOString().substring(0, 10),
        };

        return this.produtosService.atualizarQuantidade(produtoIdNumber, novaQtde).pipe(
          switchMap(() => this.produtosService.registrarMovimentacao(movimentacao))
        );
      })
    ).subscribe({
      next: (mov) => {
        this.ultimaMovimentacao = mov as Movimentacao;
        this.produtoIdInput = '';
        this.quantidade = null;
        this.motivoBaixa = '';
        setTimeout(() => { this.ultimaMovimentacao = null; }, 6000);
      },
      error: (err) => {
        const mensagem = err.message || 'Erro desconhecido de API.';
        this.notificationService.mostrarAviso('Erro de Movimentação', mensagem);
      }
    });
  }
}
