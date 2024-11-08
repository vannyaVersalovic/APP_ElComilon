import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController } from '@ionic/angular'; // Cambiar Router por NavController

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private navCtrl: NavController // Cambiar Router por NavController
  ) {}


  // Registro de usuarios
  register(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  // Inicio de sesión
  login(email: string, password: string) {
    this.afAuth.signInWithEmailAndPassword(email, password).then(userData => {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userData', JSON.stringify(userData));
    });
  }

  // Cerrar sesión
  logout() {
    this.afAuth.signOut().then(() => {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userData');
      this.navCtrl.navigateRoot('/login');
    });
  }

  async getCurrentUserId(): Promise<string> {
    // Primero intentamos obtener el ID de Firebase
    const firebaseUser = await this.afAuth.currentUser;
    if (firebaseUser) {
      return firebaseUser.uid;
    }
    
    // Si no hay usuario en Firebase, buscamos en localStorage
    const localUser = localStorage.getItem('userId');
    if (localUser) {
      return localUser;
    }
    
    // Si no hay usuario en ningún lado, creamos uno local
    const newLocalId = 'local_' + Date.now();
    localStorage.setItem('userId', newLocalId);
    return newLocalId;
  }

  async saveUserToLocal(userId: string) {
    localStorage.setItem('userId', userId);
  }

  async clearLocalUser() {
    localStorage.removeItem('userId');
  }

  async isAuthenticated(): Promise<boolean> {
    return new Promise((resolve) => {
      this.afAuth.onAuthStateChanged((user) => {
        resolve(!!user);
      });
    });
  }
}
