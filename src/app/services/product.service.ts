import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private firestore: AngularFirestore) {}

  getProducts(): Observable<any[]> {
    return this.firestore.collection('products').snapshotChanges();
  }

  addProduct(product: any): Promise<any> {
    return this.firestore.collection('products').add(product);
  }

  updateProduct(id: string, product: any): Promise<void> {
    return this.firestore.doc(`products/${id}`).update(product);
  }

  deleteProduct(id: string): Promise<void> {
    return this.firestore.doc(`products/${id}`).delete();
  }
}
