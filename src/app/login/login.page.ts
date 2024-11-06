import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService
      .login(this.email, this.password)
      .then(() => {
        alert('Inicio de sesión exitoso');
        this.router.navigate(['/home']); // Esto redirige correctamente a home
      })
      .catch((err) => {
        alert('Error en el inicio de sesión: ' + err.message);
      });
  }

  onRegisterButtonPressed() {
    this.router.navigate(['/register']);
  }
}
