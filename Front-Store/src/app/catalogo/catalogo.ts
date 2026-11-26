import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importa o Service e as interfaces de lá
import { CatalogoService, PageResult, Produto } from './catalogo.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe, DecimalPipe, FormsModule], 
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.scss',
})
export class Catalogo implements OnInit {
  paginaAtual = 0;
  tamanhoPagina = 8; 
  listagem$!: Observable<PageResult<Produto>>;

  nomeProduto: string = '';
  categoriaSelecionada: string = '';

  // INJETANDO O SERVIÇO AQUI
  private catalogoService = inject(CatalogoService);

  ngOnInit(): void {
    this.listarProdutos();
  }

  listarProdutos() {
    // Chamada real para o Backend
    this.listagem$ = this.catalogoService.listar(
      this.paginaAtual, 
      this.tamanhoPagina, 
      this.nomeProduto
    );
  }

  filtrar() {
    this.paginaAtual = 0; 
    this.listarProdutos();
  }

  limparFiltro() {
    this.nomeProduto = '';
    this.categoriaSelecionada = '';
    this.filtrar();
  }

  navegar(pagina: number) {
    this.paginaAtual = pagina;
    this.listarProdutos();
  }

  navegarProximo(listagem: PageResult<Produto>) {
    if (!listagem.last) this.navegar(listagem.number + 1);
  }

  navegarAnterior(listagem: PageResult<Produto>) {
    if (!listagem.first) this.navegar(listagem.number - 1);
  }

  paginas(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, index) => index);
  }

  registroInicial(listagem: PageResult<Produto>) {
    if (listagem.totalElements === 0) return 0;
    return (listagem.number * listagem.size) + 1;
  }

  registroFinal(listagem: PageResult<Produto>) {
    if (listagem.totalElements === 0) return 0;
    return Math.min((listagem.number + 1) * listagem.size, listagem.totalElements);
  }
}