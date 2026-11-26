import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router'; 

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenUrl = 'http://localhost:8080/oauth2/token';
   private router = inject(Router);
  
  // ATENÇÃO: Verifique se esses dados são EXATAMENTE os mesmos do application.properties
  private clientId = 'myclientid'; 
  private clientSecret = 'myclientsecret';

  fazerLogin(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`)
    });

    // Usando URLSearchParams em vez de HttpParams (mais seguro para o Spring)
    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('username', email);
    body.set('password', password);

    return this.http.post<any>(this.tokenUrl, body.toString(), { headers }).pipe(
      tap(response => {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response)); 
      })
    );
  }

   logout() {
    // Remove os dados salvos no navegador
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redireciona o usuário para a tela de login (ou home)
    this.router.navigate(['/login']);
  }

}



// import { Injectable, inject } from '@angular/core';
// import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { Observable, tap } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private http = inject(HttpClient);
//   private tokenUrl = 'http://localhost:8080/oauth2/token';
//   // Credenciais configuradas no seu application.properties
//   private clientId = 'myclientid';
//   private clientSecret = 'myclientsecret';

//   fazerLogin(email: string, password: string): Observable<any> {
//     // 1. Codifica o Client ID e Secret em Base64 para o Header Basic Auth
//     const headers = new HttpHeaders({
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'Authorization': 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`)
//     });

//     // 2. Monta o corpo da requisição conforme o padrão OAuth2 Password Grant
//     const body = new HttpParams()
//       .set('grant_type', 'password')
//       .set('username', email)
//       .set('password', password);

//     return this.http.post<any>(this.tokenUrl, body.toString(), { headers }).pipe(
//       tap(response => {
//         // Salva o token no localStorage para usar nas próximas requisições
//         localStorage.setItem('token', response.access_token);
//         localStorage.setItem('user', JSON.stringify(response)); // se o backend retornar dados do user
//       })
//     );
//   }

//   logout() {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//   }

//   isLoggedIn(): boolean {
//     return !!localStorage.getItem('token');
//   }
// }