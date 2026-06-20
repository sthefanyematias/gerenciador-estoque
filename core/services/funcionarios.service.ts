
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError, switchMap } from 'rxjs';
import { Funcionario } from '../types/types';
import { API_BASE } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class FuncionariosService {
  private readonly API = `${API_BASE}/funcionarios`;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 404) {
      return throwError(() => undefined);
    }
    return throwError(() => new Error('Ocorreu um erro na API.'));
  }

  listar(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(this.API);
  }

  buscarPorId(id: number): Observable<Funcionario | undefined> {
    return this.http.get<Funcionario>(`${this.API}/${id}`).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 404) {
          return new Observable<Funcionario | undefined>(sub => {
            sub.next(undefined);
            sub.complete();
          });
        }
        return throwError(() => new Error('Ocorreu um erro na API.'));
      })
    );
  }

  incluir(funcionario: Omit<Funcionario, 'id'>): Observable<Funcionario> {
    return this.http.post<Funcionario>(this.API, funcionario);
  }

  editar(funcionario: Partial<Funcionario>): Observable<Funcionario> {
    if (!funcionario.id) {
      return throwError(() => new Error('ID do funcionário ausente na edição.'));
    }
    return this.http.patch<Funcionario>(`${this.API}/${funcionario.id}`, funcionario);
  }

  alterarSenha(id: number, novaSenha: string): Observable<Funcionario> {
    return this.http.patch<Funcionario>(`${this.API}/${id}`, { senha: novaSenha });
  }

  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}
