import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SessionManager {
  // Estructura temporal para almacenar usuarios
  // Se debería reemplazar por una base de datos (En lo posible)
  
  private users: { [key: string]: { password: string; email: string } } = {};

  constructor() {
    this.loadUsersFromStorage(); // Cargar usuarios almacenados
  }

  // Método para realizar login
  performLogin(user: string, pass: string): boolean {
    this.loadUsersFromStorage(); // Asegurarse de cargar siempre los datos actualizados
    const userData = this.users[user];
    if (userData && userData.password === pass) {
      localStorage.setItem('currentUser', user); // Guardar usuario actual
      return true;
    } else {
      return false;
    }
  }

  // Método para registrar usuarios con persistencia
  registerUser(user: string, password: string, email: string): boolean {
    this.loadUsersFromStorage();
    if (!this.users[user]) {
      // Verifica que el usuario no exista aún
      this.users[user] = { password, email };
      this.saveUsersToStorage();
      return true; // Registro exitoso
    } else {
      return false; // El usuario ya existe
    }
  }

  // Método para cerrar sesión
  performLogout() {
    localStorage.removeItem('currentUser'); // Eliminar usuario actual del almacenamiento
  }

  // Método para cargar los usuarios desde localStorage
  private loadUsersFromStorage() {
    const usersData = localStorage.getItem('users');
    if (usersData) {
      this.users = JSON.parse(usersData);
    }
  }

  // Método para guardar los usuarios en localStorage
  private saveUsersToStorage() {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  // Método para obtener el usuario actual logueado
  getCurrentUser(): string | null {
    return localStorage.getItem('currentUser');
  }
}
