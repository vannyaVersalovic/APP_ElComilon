import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserId = new BehaviorSubject<string>('');

  constructor(
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    private firestore: AngularFirestore // Agregar Firestore
  ) {
    // Observar cambios en la autenticación
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.currentUserId.next(user.uid);
        localStorage.setItem('userId', user.uid);
      } else {
        this.currentUserId.next('');
        localStorage.removeItem('userId');
      }
    });
  }

  // Modificar el método register
  async register(email: string, password: string) {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      if (result.user) {
        // Guardar el email como userId en Firestore
        await this.firestore.collection('usuarios').doc(result.user.uid).set({
          email: email,
          userId: email // Guardamos el email como userId
        });
        await this.handleAuthSuccess(result.user);
        return result;
      }
      return null;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  // Modificar el método login para asegurar que se guarde el userId
  async login(email: string, password: string) {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      await this.handleAuthSuccess(result.user);
      return result;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
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
    const user = await this.afAuth.currentUser;
    return user ? user.uid : '';
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
        if (user) {
          // Actualizar el userId cuando se verifica la autenticación
          this.currentUserId.next(user.uid);
          localStorage.setItem('userId', user.uid);
          resolve(true);
        } else {
          this.currentUserId.next('');
          localStorage.removeItem('userId');
          resolve(false);
        }
      });
    });
  }

  // Modificar el método handleAuthSuccess
  async handleAuthSuccess(user: any) {
    if (user) {
      const isAuthenticated = await this.isAuthenticated();
      this.currentUserId.next(user.email);
      localStorage.setItem('userId', user.email);
      localStorage.setItem('isLoggedIn', 'true');
      
      if (isAuthenticated) {
        this.navCtrl.navigateRoot('/home');
      } else {
        this.navCtrl.navigateRoot('/login');
      }
    } else {
      this.navCtrl.navigateRoot('/login');
    }
  }
}
