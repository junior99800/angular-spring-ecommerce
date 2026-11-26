import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Verifica se existe um token salvo (o login salva isso)
  const token = localStorage.getItem('token');

  if (token) {
    return true; // Usuário logado, permite o acesso
  } else {
    // Não logado, redireciona para a tela de login
    router.navigate(['/login']);
    return false;
  }
};