import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAllUsers(token: string) {
    return this.http.get<any[]>('http://127.0.0.1:8000/api/users/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  createUser(userData: any, token: string) {
    return this.http.post('http://127.0.0.1:8000/api/users/', userData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  updateUser(userId: number, userData: any, token: string) {
    return this.http.put(`http://127.0.0.1:8000/api/users/${userId}`, userData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  deleteUser(userId: number, token: string) {
    return this.http.delete(`http://127.0.0.1:8000/api/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  getUser(userId: number, token: string) {
    return this.http.get<any>(`http://127.0.0.1:8000/api/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
}
