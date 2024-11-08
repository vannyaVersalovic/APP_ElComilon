import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { ApiService } from '../services/api.service';
import { LoadingController, ToastController, MenuController } from '@ionic/angular';

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
  userId: string = '';
  mostrarCarrito: boolean = false;
  navbarOpen = false;
  resultadosBusqueda: Pedido[] = [];

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private apiService: ApiService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private menu: MenuController // Agregar MenuController
  ) {}

  async ngOnInit() {
    await this.cargarPedidos();
    await this.cargarCarrito();
    this.resultadosBusqueda = [...this.pedidos];
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
      this.resultadosBusqueda = [...this.pedidos]; // Actualizar también resultadosBusqueda
    } catch (error) {
      console.error('Error al cargar menú:', error);
    }

    loading.dismiss();
  }

  async buscarPedidos() {
    console.log('Buscando:', this.busqueda); // Para debugging

    if (!this.busqueda || this.busqueda.trim() === '') {
      this.resultadosBusqueda = [...this.pedidos];
      return;
    }

    const busquedaLower = this.busqueda.toLowerCase().trim();
    
    // Primero buscar en los datos locales
    this.resultadosBusqueda = this.pedidos.filter(pedido => 
      pedido.strMeal.toLowerCase().includes(busquedaLower) ||
      (pedido.strCategory && pedido.strCategory.toLowerCase().includes(busquedaLower))
    );

    // Si no hay resultados locales, buscar en la API
    if (this.resultadosBusqueda.length === 0) {
      const loading = await this.loadingCtrl.create({
        message: 'Buscando...',
        duration: 10000 // máximo 10 segundos
      });
      await loading.present();

      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${this.busqueda}`);
        const data = await response.json();
        this.resultadosBusqueda = data.meals || [];
        
        if (this.resultadosBusqueda.length === 0) {
          this.mostrarMensajeNoResultados();
        }
      } catch (error) {
        console.error('Error en la búsqueda:', error);
        this.resultadosBusqueda = [];
        this.mostrarError();
      } finally {
        loading.dismiss();
      }
    }
  }

  async mostrarMensajeNoResultados() {
    const toast = await this.toastCtrl.create({
      message: 'No se encontraron resultados',
      duration: 2000,
      position: 'bottom',
      color: 'warning'
    });
    toast.present();
  }

  async mostrarError() {
    const toast = await this.toastCtrl.create({
      message: 'Error al realizar la búsqueda',
      duration: 2000,
      position: 'bottom',
      color: 'danger'
    });
    toast.present();
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

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  openMenu() {
    this.menu.toggle();
  }
}
