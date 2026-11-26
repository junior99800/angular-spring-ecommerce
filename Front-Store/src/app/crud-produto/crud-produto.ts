import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogoService, PageResult, Produto } from '../catalogo/catalogo.service'; // Ajuste o caminho
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/auth-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crudproduto',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe, DecimalPipe, FormsModule],
  templateUrl: './crud-produto.html',
  styleUrl: './crud-produto.scss',
})
export class Crudproduto implements OnInit {
  paginaAtual = 0;
  tamanhoPagina = 4; // Na foto mostra 4 itens por página
  listagem$!: Observable<PageResult<Produto>>;
  toast = inject(ToastrService);
  private authService = inject(AuthService);

  nomeProduto: string = '';
  categoriaSelecionada: string = '';

  private catalogoService = inject(CatalogoService);

  ngOnInit(): void {
    this.listarProdutos();
  }

  listarProdutos() {
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

  //   
  // excluirProduto(id: number): void {
  //   // 1. Pergunta ao usuário se ele tem certeza
  //   if (confirm('Tem certeza que deseja excluir este produto?')) {
      
  //     // 2. Usa o nome correto do serviço (this.catalogoService)
  //     this.catalogoService.deletar(id).subscribe({
  //       next: () => {
  //         // 3. Mensagem de sucesso corrigida
  //         this.toast.success('Produto excluído com sucesso!');
  //         this.listarProdutos(); 
  //       },
  //       error: (erro) => {
  //         console.error(erro);
  //         // 4. Mensagem de erro corrigida
  //         this.toast.error('Erro ao excluir produto. Verifique se ele está atrelado a outras tabelas.');
  //       }
  //     });
  //   }
  // }

  //   excluirProduto(id: number): void {
  //   Swal.fire({
  //     title: 'Tem certeza?',
  //     text: "Você não poderá reverter esta exclusão!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#407bff', // O azul do seu projeto
  //     cancelButtonColor: '#d33',     // Vermelho
  //     confirmButtonText: 'Sim, excluir!',
  //     cancelButtonText: 'Cancelar'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       // Se o usuário clicou em confirmar, chama a API
  //       this.catalogoService.deletar(id).subscribe({
  //         next: () => {
  //           // Alerta de sucesso bonito
  //           Swal.fire('Excluído!', 'O produto foi removido com sucesso.', 'success');
  //           this.listarProdutos(); 
  //         },
  //         error: (erro) => {
  //           console.error(erro);
  //           Swal.fire('Erro!', 'Não foi possível excluir o produto.', 'error');
  //         }
  //       });
  //     }
  //   });
  // }




  excluirProduto(id: number): void {
    // 1º Passo: O Alerta de Confirmação
    Swal.fire({
      title: "Tem certeza?",
      text: "Você não poderá reverter esta ação!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#407bff',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      
      // Se o usuário clicou no botão "Sim, excluir!"
      if (result.isConfirmed) {
        
        // 2º Passo: Chama o backend para deletar
        this.catalogoService.deletar(id).subscribe({
          next: () => {
            
            // 3º Passo: O Alerta de Sucesso (com o Nyan Cat!)
            Swal.fire({
              title: "Apagado com sucesso.",
              width: 600,
              padding: "3em",
              color: "#716add",
              background: "#fff url(https://sweetalert2.github.io/images/trees.png)",
              backdrop: `
                rgba(0,0,123,0.4)
                url("https://sweetalert2.github.io/images/nyan-cat.gif")
                left top
                no-repeat
              `
            });
            
            // Atualiza a lista de produtos na tela
            this.listarProdutos(); 
          },
          error: (erro) => {
            console.error(erro);
            // Alerta de erro caso o backend recuse a exclusão
            Swal.fire('Erro!', 'Não foi possível excluir o produto.', 'error');
          }
        });
      }
    });
  }

  sair() {
    this.authService.logout();
  }

}