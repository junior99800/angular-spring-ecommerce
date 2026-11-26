import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  // 1. Se a requisição for para o endpoint de login, NÃO adiciona o Bearer
  // Deixa a requisição passar com o Basic Auth que o auth-service montou.
  if (req.url.includes('/oauth2/token')) {
    return next(req);
  }

  // 2. Para as outras rotas (ex: deletar produto), adiciona o Bearer Token
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};