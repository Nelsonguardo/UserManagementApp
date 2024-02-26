import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router'; // Importa el servicio Router

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: any;
  isAdmin!: boolean;

  constructor(private http: HttpClient, private router: Router) { } // Inyectar Router en el constructor

  ngOnInit(): void {
    // Recuperar información del usuario desde el almacenamiento local
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      this.user = JSON.parse(userString);
      this.isAdmin = this.user.is_admin === 1; // Verificar si el usuario es administrador
      //console.log(this.isAdmin);
    } else {
      // Handle the case where 'user' is not found in localStorage
      console.log('User not found in localStorage');
    }
  }

  logout() {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');
    
    // Verificar si el token existe
    if (!token) {
      console.error('Token not found in localStorage');
      return;
    }

    // Configurar el encabezado con el token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Realizar la solicitud POST para cerrar sesión con el token en el encabezado
    this.http.post('http://127.0.0.1:8000/api/auth/logout', {}, { headers }).subscribe(
      () => {
        console.log('Logout successful');
        // Borra los datos del localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirigir al usuario a la página de inicio de sesión
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Logout failed', error);
      }
    );
  }

}
