import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private urlBase = 'https://www.themealdb.com/api/json/v1/1/';

  constructor(private http: HttpClient) {}

  buscarComidas(): Observable<any> {
    return this.http.get(`${this.urlBase}search.php?s=`);
  }

  buscarComidaPorNombre(nombre: string): Observable<any> {
    return this.http.get(`${this.urlBase}search.php?s=${nombre}`);
  }

  buscarComidaPorCategoria(categoria: string): Observable<any> {
    return this.http.get(`${this.urlBase}filter.php?c=${categoria}`);
  }

  obtenerCategorias(): Observable<any> {
    return this.http.get(`${this.urlBase}categories.php`);
  }

  obtenerComidaAleatoria(): Observable<any> {
    return this.http.get(`${this.urlBase}random.php`);
  }
}
