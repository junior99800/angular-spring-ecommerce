import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth-service';
import { LoginForm } from '../dados-auth'; // <-- Importando o modelo

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  // Tipando a variável com a interface que você criou
  form: LoginForm = {
    email: '',
    password: ''
  };
  
  private authService = inject(AuthService);
  private router = inject(Router);

  fazerLogin() {
    if (!this.form.email || !this.form.password) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    // Passando os dados tipados para o serviço
    this.authService.fazerLogin(this.form.email, this.form.password).subscribe({
      next: (resposta) => {
        console.log('Login realizado com sucesso!', resposta);
        this.router.navigate(['/admin/produtos']); 
      },
      error: (erro) => {
        console.error('Erro no login', erro);
        alert('Email ou senha inválidos.');
      }
    });
  }
}