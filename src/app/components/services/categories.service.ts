import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getAllCategories(token: string) {
    return this.http.get<any[]>('http://127.0.0.1:8000/api/categories/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  createCategory(categoryData: any, token: string) {
    return this.http.post('http://127.0.0.1:8000/api/categories/', categoryData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  updateCategory(categoryId: number, categoryData: any, token: string) {
    return this.http.put(`http://127.0.0.1:8000/api/categories/${categoryId}`, categoryData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  deleteCategory(categoryId: number, token: string) {
    return this.http.delete(`http://127.0.0.1:8000/api/categories/${categoryId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  getCategory(categoryId: number, token: string) {
    return this.http.get<any>(`http://127.0.0.1:8000/api/categories/${categoryId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
}
