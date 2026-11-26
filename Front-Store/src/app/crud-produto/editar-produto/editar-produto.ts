import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CatalogoService, Categoria } from '../../catalogo/catalogo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-produto',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './editar-produto.html',
  styleUrl: './editar-produto.scss',
})
export class EditarProduto implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private catalogoService = inject(CatalogoService);

  produtoId!: number;
  categorias: Categoria[] = [];
  
  // Objeto que será enviado no PUT
  produtoForm: any = {
    name: '',
    description: '',
    price: null,
    imgUrl: '',
    categories: [] 
  };
  
  categoriaSelecionadaId: number | null = null;
  arquivoSelecionado: File | null = null;

  ngOnInit(): void {
    this.produtoId = Number(this.route.snapshot.paramMap.get('id'));
    this.carregarCategorias();
    this.carregarProduto();
  }

  carregarCategorias() {
    this.catalogoService.buscarCategorias().subscribe({
      next: (res) => this.categorias = res.content,
      error: (erro) => console.error('Erro ao buscar categorias', erro)
    });
  }

  carregarProduto() {
    this.catalogoService.buscarPorId(this.produtoId).subscribe({
      next: (produto) => {
        this.produtoForm.name = produto.name;
        this.produtoForm.description = produto.description;
        this.produtoForm.price = produto.price;
        this.produtoForm.imgUrl = produto.imgUrl;
        
        // Se o produto já tiver uma categoria, seleciona a primeira na lista
        if (produto.categories && produto.categories.length > 0) {
          this.categoriaSelecionadaId = produto.categories[0].id;
        }
      },
      error: (erro) => console.error('Erro ao buscar produto', erro)
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.arquivoSelecionado = file;
      // Aqui você pode chamar o serviço de upload e atualizar o this.produtoForm.imgUrl
      // this.catalogoService.uploadImagem(file).subscribe(url => this.produtoForm.imgUrl = url);
    }
  }

  salvar() {
    // Formata as categorias para o padrão que o Java espera: [{ "id": 1 }]
    if (this.categoriaSelecionadaId) {
      this.produtoForm.categories = [{ id: this.categoriaSelecionadaId }];
    } else {
      this.produtoForm.categories = [];
    }

     if (this.produtoForm.price !== null && this.produtoForm.price !== undefined) {
      // Substitui a vírgula por ponto e converte para número
      this.produtoForm.price = Number(this.produtoForm.price.toString().replace(',', '.'));
    }


    this.catalogoService.atualizar(this.produtoId, this.produtoForm).subscribe({
      next: () => {
        Swal.fire('Sucesso!', 'Produto atualizado com sucesso.', 'success');
        this.router.navigate(['/admin/produtos']); // Volta para a listagem
      },
      error: (erro) => {
        console.error(erro);
        Swal.fire('Erro!', 'Não foi possível atualizar o produto.', 'error');
      }
    });
  }

  cancelar() {
    this.router.navigate(['/admin/produtos']);
  }

    bloquearLetras(event: KeyboardEvent) {
    // Bloqueia as teclas: e, E, +, -
    const teclasInvalidas = ['e', 'E', '+', '-'];
    
    if (teclasInvalidas.includes(event.key)) {
      event.preventDefault();
    }
  }
}