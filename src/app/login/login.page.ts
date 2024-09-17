import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionManager } from '../managers/SessionManager';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private router: Router, private sessionManager:SessionManager) { }

  email: string = '';  
  user: string = '';
    password: string = '';

  ngOnInit() {
  }

  onLoginButtonPressed() {
    if(this.sessionManager.performLogin(this.user, this.password)) {
      alert('Inicio de sesión exitoso');
      // Redirigimos al home después del login exitoso
      this.router.navigate(['/home'], {queryParams: { email: this.email }});
    } else {
      alert('Credenciales inválidas. Inténtalo de nuevo.');
      this.user = '';
      this.password = '';
    }
  }

  onRegisterButtonPressed() {
    this.router.navigate(['/register'])
  }

}

