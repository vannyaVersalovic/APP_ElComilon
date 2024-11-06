import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  nombre: string = '';
  apellido: string = '';
  email: string = '';
  password: string = '';
  user: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  onRegisterButtonPressed() {
    if (this.nombre && this.apellido && this.email && this.user && this.password) {
      this.authService
        .register(this.email, this.password)
        .then(() => {
          alert('Registro exitoso. Ahora puedes iniciar sesión.');
          this.router.navigate(['/login']);
        })
        .catch((err) => {
          alert('Error en el registro: ' + err.message);
        });
    } else {
      alert('Por favor, completa todos los campos.');
    }
  }
}

