import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class SessionManager {
    // Estructura temporal para almacenar usuarios
    private users: { [key: string]: { password: string, email: string } } = {};

    // Método para realizar login
    performLogin(user: string, pass: string): boolean {
        const userData = this.users[user];
        if (userData && userData.password === pass) {
            return true;
        } else {
            return false;
        }
    }

    // Método para registrar usuarios temporalmente
    registerUser(user: string, password: string, email: string): boolean {
        if (!this.users[user]) { // Verifica que el usuario no exista aún
            this.users[user] = { password, email };
            return true; // Registro exitoso
        } else {
            return false; // El usuario ya existe
        }
    }

    // Método para cerrar sesión (puedes implementar lógica aquí si lo necesitas)
    performLogout() {
        // TODO: lógica de cerrar sesión si fuera necesario
    }
}
