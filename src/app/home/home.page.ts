import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionManager } from 'src/app/managers/SessionManager';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  constructor(private sessionManager: SessionManager, private router: Router) {}

  navigateToLogin() {
    this.sessionManager.performLogout();
    this.router.navigate(['/login']); // Redirigir a la página de login
  }
}
