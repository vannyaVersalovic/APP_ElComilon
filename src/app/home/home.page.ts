import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { ApiService } from '../services/api.service';
import { LoadingController, ToastController } from '@ionic/angular';

interface Pedido {
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  pedidos: Pedido[] = [];
  busqueda: string = '';
  carrito: any[] = [];
  userId: string = 'usuario123';
  mostrarCarrito: boolean = false;

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private apiService: ApiService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.cargarPedidos();
    this.cargarCarrito();
  }

  async cargarCarrito() {
    this.carrito = await this.firebaseService.getCartItems(this.userId);
  }

  async cargarPedidos() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando menú...'
    });
    await loading.present();

    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
      const data = await response.json();
      this.pedidos = data.meals || [];
    } catch (error) {
      console.error('Error al cargar menú:', error);
    }

    loading.dismiss();
  }

  buscarPedidos() {
    if (this.busqueda.trim() === '') {
      this.cargarPedidos();
      return;
    }
    
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${this.busqueda}`)
      .then(response => response.json())
      .then(data => {
        this.pedidos = data.meals || [];
      });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateTo(recipe: any, route: string) {
    this.router.navigate([route], { state: { recipe } });
  }

  async addProductToFirestore(recipe: any) {
    await this.addToCart(recipe);
  }

  async addToCart(pedido: Pedido) {
    const loading = await this.loadingCtrl.create({
      message: 'Agregando al carrito...'
    });
    await loading.present();

    try {
      const success = await this.firebaseService.addToCart(pedido, this.userId);
      if (success) {
        const toast = await this.toastCtrl.create({
          message: 'Pedido agregado al carrito',
          duration: 2000,
          position: 'bottom',
          color: 'success'
        });
        toast.present();
        await this.cargarCarrito();
      }
    } catch (error) {
      console.error('Error:', error);
    }

    loading.dismiss();
  }

  verCarrito() {
    this.mostrarCarrito = true;
  }

  cerrarCarrito() {
    this.mostrarCarrito = false;
  }

  async realizarPedido() {
    const loading = await this.loadingCtrl.create({
      message: 'Procesando pedido...'
    });
    await loading.present();

    try {
      const success = await this.firebaseService.realizarPedido(this.userId);
      if (success) {
        const toast = await this.toastCtrl.create({
          message: 'Pedido realizado con éxito',
          duration: 2000,
          position: 'bottom',
          color: 'success'
        });
        toast.present();
        this.mostrarCarrito = false;
        await this.cargarCarrito();
      }
    } catch (error) {
      console.error('Error al realizar pedido:', error);
    }

    loading.dismiss();
  }
}
