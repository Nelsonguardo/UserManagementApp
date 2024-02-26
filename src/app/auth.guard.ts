import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    if (localStorage.getItem('token')) {
      // El usuario está autenticado, permitir el acceso
      return true;
    } else {
      // El usuario no está autenticado, redirigir al componente de inicio de sesión
      this.router.navigate(['/login']);
      return false;
    }
  }
}
