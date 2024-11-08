import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carritoItems = new BehaviorSubject<any[]>([]);
  private productos = new BehaviorSubject<any[]>([]); // Agregamos productos

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {
    this.cargarCarritoFirebase();
  }

  private async cargarCarritoFirebase() {
    try {
      const userId = await this.authService.getCurrentUserId();
      this.firestore
        .collection(`carritos/${userId}/items`)
        .valueChanges({ idField: 'id' }) // Agregamos el ID del documento
        .subscribe(items => {
          this.carritoItems.next(items);
        });
    } catch (error) {
      console.error('Error al cargar carrito:', error);
      this.carritoItems.next([]);
    }
  }

  async agregarItem(item: any) {
    try {
      const userId = await this.authService.getCurrentUserId();
      if (!userId) {
        throw new Error('Usuario no autenticado');
      }
      
      await this.firestore.collection(`carritos/${userId}/items`).add({
        ...item,
        userId,
        fecha: new Date(),
        estado: 'pendiente',
        cantidad: 1
      });

    } catch (error) {
      console.error('Error al agregar item:', error);
      throw error;
    }
  }

  async eliminarItem(item: any) {
    try {
      const userId = await this.authService.getCurrentUserId();
      // Eliminar de Firebase
      await this.firestore
        .doc(`carritos/${userId}/items/${item.id}`)
        .delete();
      
      // Actualizar el BehaviorSubject local
      const items = this.carritoItems.getValue();
      const index = items.findIndex(i => i.id === item.id);
      if (index > -1) {
        items.splice(index, 1);
        this.carritoItems.next(items);
      }
    } catch (error) {
      console.error('Error al eliminar item:', error);
      throw error;
    }
  }

  async limpiarCarrito() {
    const userId = await this.authService.getCurrentUserId();
    const itemsRef = this.firestore.collection(`carritos/${userId}/items`);
    const items = await itemsRef.get().toPromise();
    items?.forEach(item => {
      item.ref.delete();
    });
  }

  getCarrito(): Observable<any[]> {
    return this.carritoItems.asObservable();
  }

  async obtenerCarrito(): Promise<any[]> {
    return this.carritoItems.getValue();
  }

  async getTotal(): Promise<number> {
    const items = this.carritoItems.value;
    return items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }

  // Métodos para productos
  getProductos(): Observable<any[]> {
    return this.productos.asObservable();
  }

  async cargarProductos() {
    try {
      const userId = await this.authService.getCurrentUserId();
      this.firestore
        .collection('productos')
        .valueChanges({ idField: 'id' })
        .subscribe(productos => {
          this.productos.next(productos);
        });
    } catch (error) {
      console.error('Error al cargar productos:', error);
      this.productos.next([]);
    }
  }

  async agregarProducto(producto: any) {
    try {
      return await this.firestore
        .collection('productos')
        .add({
          ...producto,
          fecha: new Date()
        });
    } catch (error) {
      console.error('Error al agregar producto:', error);
      throw error;
    }
  }
}