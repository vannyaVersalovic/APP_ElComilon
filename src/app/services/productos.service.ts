
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  constructor(private firestore: AngularFirestore) {}

  obtenerProductos() {
    return this.firestore.collection('productos').valueChanges();
  }

  agregarProducto(producto: any) {
    return this.firestore.collection('productos').add(producto);
  }
}