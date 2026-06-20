
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Produto, Movimentacao } from '../../core/types/types';
import { FormsModule } from '@angular/forms';
import { ProdutosService } from './../../core/services/produtos.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-consultar',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './consultar.html',
    styleUrl: './consultar.css',
})
export class Consultar {
    idBusca: number | null = null;
    produtoEncontrado: Produto | null = null;
    movimentacoes: Movimentacao[] = [];
    erroBusca: string = '';

    constructor(private service: ProdutosService, private router: Router) { }

    buscarProduto(): void {
        this.erroBusca = '';
        this.produtoEncontrado = null;
        this.movimentacoes = [];

        if (this.idBusca) {
            this.service.buscarPorId(this.idBusca).subscribe({
                next: (produto) => {
                    if (produto) {
                        this.produtoEncontrado = produto;
                        this.service.buscarMovimentacoesPorProduto(this.idBusca!).subscribe({
                            next: (movs) => {
                                this.movimentacoes = movs.sort((a, b) =>
                                    new Date(b.data).getTime() - new Date(a.data).getTime()
                                ).slice(0, 10);
                            }
                        });
                        this.idBusca = null;
                    } else {
                        this.erroBusca = `Produto com código ${this.idBusca} não encontrado.`;
                    }
                },
                error: () => {
                    this.erroBusca = 'Produto não encontrado ou erro na comunicação com o servidor.';
                }
            });
        } else {
            this.erroBusca = 'Por favor, informe um código.';
        }
    }

    getStatusClass(quantidade: number): string {
        if (quantidade <= 5) return 'status-critico';
        else if (quantidade > 20) return 'status-positivo';
        else return 'status-alerta';
    }
}
