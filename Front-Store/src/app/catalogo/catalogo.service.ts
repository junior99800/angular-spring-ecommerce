import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface PageResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface Categoria {
  id: number;
  name: string;
}

export interface Produto {
  id: number;
  name: string;        // Nome em inglês, igual ao Java
  description: string;
  price: number;       // Preço em inglês
  imgUrl: string;      // Imagem em inglês
  date: string;
  categories: Categoria[];
}

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/products';

  listar(page: number = 0, size: number = 8, nome?: string): Observable<PageResult<Produto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (nome) {
      params = params.set('name', nome);
    }

    return this.http.get<PageResult<Produto>>(this.baseUrl, { params });
  }
  
    // Buscar produto por ID
    buscarPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.baseUrl}/${id}`);
  }

    deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

   buscarCategorias(): Observable<PageResult<Categoria>> {
    const url = 'http://localhost:8080/categories?page=0&size=12&sort=name,asc';
    return this.http.get<PageResult<Categoria>>(url);
  }

  

 
  atualizar(id: number, produto: any): Observable<Produto> {
    return this.http.put<Produto>(`${this.baseUrl}/${id}`, produto);
  }

   criar(produto: any): Observable<Produto> {
    return this.http.post<Produto>(this.baseUrl, produto);
  }
}