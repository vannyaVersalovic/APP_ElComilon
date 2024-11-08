import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

interface CartItem {
  id?: string;  
  userId: string;
  producto: string;
  precio: number;
  imagen: string;
  cantidad: number;
  fecha: Date;
  estado: string;
}

interface Pedido {
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  // Agregar pedido al carrito
  async addToCart(pedido: Pedido, userId: string) {
    try {
      const user = await this.afAuth.currentUser;
      const email = user ? user.email : userId; // Usar el email como userId

      const cartItemRef = await this.firestore.collection('carritos').add({
        userId: email, // Usar el email como userId
        producto: pedido.strMeal || 'Producto sin nombre',
        precio: 9.99,
        imagen: pedido.strMealThumb || '',
        cantidad: 1,
        fecha: new Date(),
        estado: 'pendiente'
      });

      // Retornamos verdadero solo si se creó el documento
      return !!cartItemRef.id;
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      return false;
    }
  }

  // Obtener pedidos del usuario
  async getCartItems(userId: string): Promise<CartItem[]> {
    try {
      const snapshot = await this.firestore.collection<CartItem>('carritos', ref => 
        ref.where('userId', '==', userId)
      ).get().toPromise();
      
      return snapshot?.docs.map(doc => ({
        id: doc.id,  // El id siempre existirá desde Firestore
        ...(doc.data() as Omit<CartItem, 'id'>)
      })) || [];
    } catch (error) {
      console.error('Error al obtener items del carrito:', error);
      return [];
    }
  }

  // Eliminar item del carrito
  async removeFromCart(itemId: string) {
    try {
      await this.firestore.doc(`carritos/${itemId}`).delete();
      return true;
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
      return false;
    }
  }

  // Actualizar cantidad de un item
  async updateCartItemQuantity(itemId: string, cantidad: number) {
    try {
      await this.firestore.doc(`carritos/${itemId}`).update({ cantidad });
      return true;
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      return false;
    }
  }

  // Realizar pedido
  async realizarPedido(userId: string) {
    try {
      const items = await this.getCartItems(userId);
      
      // Verificar que todos los items tengan id
      if (items.some(item => !item.id)) {
        throw new Error('Algunos items no tienen ID');
      }

      await this.firestore.collection('pedidos').add({
        userId,
        items,
        fecha: new Date(),
        estado: 'nuevo',
        total: items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0)
      });

      // Limpiar carrito
      for (const item of items) {
        if (item.id) {  // Verificación extra por seguridad
          await this.removeFromCart(item.id);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error al realizar pedido:', error);
      return false;
    }
  }
}
