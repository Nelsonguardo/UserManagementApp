import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Obtener el usuario del localStorage
    const userString = localStorage.getItem('user');

    // Verificar si el usuario existe y si está autenticado
    if (userString && localStorage.getItem('token')) {
      const user = JSON.parse(userString);

      // Verificar si el usuario es administrador
      if (user.is_admin === 1) {
        // El usuario es administrador, permitir el acceso a todas las rutas protegidas
        return true;
      } else {
        // El usuario no es administrador, permitir el acceso solo a la ruta de bienvenida
        if (state.url === '/welcome') {
          return true;
        } else {
          // Redirigir al componente de bienvenida
          this.router.navigate(['/welcome']);
          return false;
        }
      }
    } else {
      // El usuario no está autenticado, redirigir al componente de inicio de sesión
      this.router.navigate(['/login']);
      return false;
    }
  }
}
