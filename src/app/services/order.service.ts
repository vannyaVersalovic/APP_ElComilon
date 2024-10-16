import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private firestore: AngularFirestore) {}

  // Crear un nuevo pedido
  createOrder(order: any) {
    return this.firestore.collection('orders').add(order);
  }

  // Obtener todos los pedidos
  getOrders() {
    return this.firestore.collection('orders').snapshotChanges();
  }
}
