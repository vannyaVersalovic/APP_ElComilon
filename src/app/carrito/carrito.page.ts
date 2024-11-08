import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CarritoService } from '../services/carrito.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  carritoItems: any[] = [];
  total: number = 0;

  constructor(
    private alertController: AlertController,
    private router: Router,
    private carritoService: CarritoService
  ) { }

  ngOnInit() {
    this.carritoService.getCarrito().subscribe(async items => {
      this.carritoItems = items;
      this.total = await this.carritoService.getTotal();
    });
  }

  async eliminarItem(item: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas eliminar este item?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.carritoService.eliminarItem(item);
            this.total = await this.carritoService.getTotal();
          }
        }
      ]
    });
    await alert.present();
  }

  async limpiarCarrito() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas vaciar el carrito?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.carritoService.limpiarCarrito();
          }
        }
      ]
    });
    await alert.present();
  }

  async confirmarPedido() {
    if (this.carritoItems.length === 0) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'El carrito está vacío',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const alert = await this.alertController.create({
      header: 'Pedido Confirmado',
      message: '¡Gracias por tu compra!',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.carritoService.limpiarCarrito();
          this.router.navigate(['/home']);
        }
      }]
    });
    await alert.present();
  }

  private async guardarCarrito() {
    await this.carritoService.limpiarCarrito();
    for (const item of this.carritoItems) {
      await this.carritoService.agregarItem(item);
    }
    this.total = await this.carritoService.getTotal();
  }
}
