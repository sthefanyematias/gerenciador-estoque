
import { Produto, Movimentacao } from '../types/types';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';
import { API_BASE } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class ProdutosService {
  private readonly API = `${API_BASE}/estoque`;
  private readonly API_MOV = `${API_BASE}/movimentacoes`;

  constructor(private http: HttpClient) {}

  private handleApiError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro desconhecido na comunicação com a API.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro do Cliente: ${error.error.message}`;
    } else if (error.status === 404) {
      errorMessage = 'Recurso não encontrado (404). Verifique o endpoint da API.';
    } else if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Erro do Servidor: ${error.status} - ${error.statusText || 'Falha na Requisição'}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  incluir(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.API, produto).pipe(
      catchError(this.handleApiError.bind(this))
    );
  }

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.API).pipe(
      catchError(this.handleApiError.bind(this))
    );
  }

  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`).pipe(
      catchError(this.handleApiError.bind(this))
    );
  }

  buscarPorId(id: number): Observable<Produto | undefined> {
    return this.http.get<Produto>(`${this.API}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return new Observable<Produto | undefined>(sub => {
            sub.next(undefined);
            sub.complete();
          });
        }
        return throwError(() => new Error('Falha na comunicação com a API.'));
      })
    );
  }

  editar(produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.API}/${produto.id}`, produto).pipe(
      catchError(this.handleApiError.bind(this))
    );
  }

  atualizarQuantidade(id: number, novaQuantidade: number): Observable<Produto> {
    return this.http.patch<Produto>(`${this.API}/${id}`, { quantidade: novaQuantidade }).pipe(
      catchError(this.handleApiError.bind(this))
    );
  }

  registrarMovimentacao(movimentacao: Omit<Movimentacao, 'id'>): Observable<Movimentacao> {
    return this.http.post<Movimentacao>(this.API_MOV, movimentacao).pipe(
      catchError(this.handleApiError.bind(this))
    );
  }

  buscarMovimentacoesPorProduto(produtoId: number): Observable<Movimentacao[]> {
    return this.http.get<Movimentacao[]>(`${this.API_MOV}?produtoId=${produtoId}`).pipe(
      catchError(() => new Observable<Movimentacao[]>(sub => { sub.next([]); sub.complete(); }))
    );
  }
}
