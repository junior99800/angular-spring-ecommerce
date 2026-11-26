import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { CatalogoService, Produto } from '../catalogo/catalogo.service'; // Ajuste o caminho se estiver em pastas diferentes

@Component({
  selector: 'app-productdescription',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe, RouterLink],
  templateUrl: './productdescription.html',
  styleUrl: './productdescription.scss'
})
export class Productdescription implements OnInit {
  produto$!: Observable<Produto>;
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private catalogoService = inject(CatalogoService);

  ngOnInit(): void {
    // Pega o ID da URL (ex: /catalogo/3 -> id = 3)
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.produto$ = this.catalogoService.buscarPorId(id);
  }

  voltar() {
    // Navega de volta para a listagem do catálogo
    this.router.navigate(['/catalogo']);
  }
}