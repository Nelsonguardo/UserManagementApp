import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  // Obtiene todas las categorías
  getAllCategories(token: string) {
    return this.http.get<any[]>('http://127.0.0.1:8000/api/categories/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  // Crea una nueva categoría
  createCategory(categoryData: any, token: string) {
    return this.http.post('http://127.0.0.1:8000/api/categories/', categoryData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  // Actualiza una categoría existente
  updateCategory(categoryId: number, categoryData: any, token: string) {
    return this.http.put(`http://127.0.0.1:8000/api/categories/${categoryId}`, categoryData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  // Elimina una categoría existente
  deleteCategory(categoryId: number, token: string) {
    return this.http.delete(`http://127.0.0.1:8000/api/categories/${categoryId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  // Obtiene una categoría específica por su ID
  getCategory(categoryId: number, token: string) {
    return this.http.get<any>(`http://127.0.0.1:8000/api/categories/${categoryId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
}
