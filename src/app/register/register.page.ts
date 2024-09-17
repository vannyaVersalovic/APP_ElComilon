import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionManager } from '../managers/SessionManager';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  nombre: string= '';
  apellido: string= '';
  email: string='';
  password: string='';
  user: string='';

  constructor(private router: Router, private sessionManager: SessionManager) { }

  // Asegúrate de que el método ngOnInit esté presente
  ngOnInit() { 
    // Lógica opcional que quieras inicializar al cargar la página
  }

  onRegisterButtonPressed() {
    if (this.nombre && this.apellido && this.email && this.user && this.password) {
      // Intentamos registrar al usuario
      const isRegistered = this.sessionManager.registerUser(this.user, this.password, this.email);
      if (isRegistered) {
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        // Redirigimos al login después de un registro exitoso
        this.router.navigate(['/login']);
      } else {
        alert('El usuario ya existe.');
      }
    } else {
      alert('Por favor, completa todos los campos.');
    }
  }
}

