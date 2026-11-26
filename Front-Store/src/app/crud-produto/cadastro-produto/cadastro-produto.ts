import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CatalogoService, Categoria } from '../../catalogo/catalogo.service'; // Ajuste o caminho se necessário
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cadastro-produto',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './cadastro-produto.html',
  styleUrl: './cadastro-produto.scss',
})
export class CadastroProduto implements OnInit {
  private router = inject(Router);
  private catalogoService = inject(CatalogoService);

  categorias: Categoria[] = [];
  
  // Objeto para o POST
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
    this.carregarCategorias();
  }

  carregarCategorias() {
    this.catalogoService.buscarCategorias().subscribe({
      next: (res) => this.categorias = res.content,
      error: (erro) => console.error('Erro ao buscar categorias', erro)
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.arquivoSelecionado = file;
      // Aqui entraria a lógica de upload da imagem se você já tiver implementado
    }
  }

  salvar() {
    // Validação básica
    if (!this.produtoForm.name || !this.produtoForm.price) {
      Swal.fire('Atenção', 'Preencha o nome e o preço do produto.', 'warning');
      return;
    }

    // Formata a categoria no padrão do backend: [{ "id": 1 }]
    if (this.categoriaSelecionadaId) {
      this.produtoForm.categories = [{ id: this.categoriaSelecionadaId }];
    }

     if (this.produtoForm.price !== null && this.produtoForm.price !== undefined) {
      // Substitui a vírgula por ponto e converte para número
      this.produtoForm.price = Number(this.produtoForm.price.toString().replace(',', '.'));
    }

    this.catalogoService.criar(this.produtoForm).subscribe({
      next: () => {
        Swal.fire('Sucesso!', 'Produto cadastrado com sucesso.', 'success');
        this.router.navigate(['/admin/produtos']); 
      },
      error: (erro) => {
        console.error(erro);
        Swal.fire('Erro!', 'Não foi possível cadastrar o produto. Verifique os campos.', 'error');
      }
    });
  }

  cancelar() {
    this.router.navigate(['/admin/produtos']);
  }
}