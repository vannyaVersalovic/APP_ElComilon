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
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/home']);
    } catch (error: any) {
      const errorMessage = error?.message || 'Error desconocido';
      alert('Error: ' + this.getErrorMessage(errorMessage));
    } finally {
      this.isLoading = false;
    }
  }

  private validateForm(): boolean {
    if (!this.email || !this.password) {
      alert('Por favor complete todos los campos');
      return false;
    }
    if (!this.email.includes('@')) {
      alert('Por favor ingrese un email válido');
      return false;
    }
    return true;
  }

  private getErrorMessage(error: string): string {
    if (error.includes('wrong-password')) {
      return 'Contraseña incorrecta';
    }
    if (error.includes('user-not-found')) {
      return 'Usuario no encontrado';
    }
    return 'Error al iniciar sesión';
  }

  onRegisterButtonPressed() {
    this.router.navigate(['/register']);
  }

}
