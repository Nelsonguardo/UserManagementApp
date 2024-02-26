import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userData = { email: '', password: '' }; // Datos del usuario para el inicio de sesión
  errorMessage: string = ''; // Mensaje de error para mostrar al usuario en caso de problemas durante el inicio de sesión

  constructor(private http: HttpClient, private router: Router) { }

  // Método para realizar el inicio de sesión del usuario
  login() {
    const url = 'http://127.0.0.1:8000/api/auth/login'; // URL de la API para iniciar sesión

    // Envío de la solicitud HTTP POST para iniciar sesión
    this.http.post(url, this.userData)
      .subscribe((response: any) => {
        // Manejo de la respuesta del servidor
        const token = response.token; // Token de autenticación devuelto por el servidor
        const user = response.user; // Datos del usuario devueltos por el servidor

        // Almacenar el token y los datos del usuario en el almacenamiento local del navegador
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Redirigir a la página de bienvenida después del inicio de sesión exitoso
        this.router.navigate(['/welcome']);
      }, error => {
        // Manejo de errores
        if (error.status === 401) {
          // Error de credenciales inválidas
          this.errorMessage = 'Credenciales inválidas';
        } else if (error.status === 402) {
          // Error de contraseña vencida, se redirige al usuario a cambiar la contraseña
          const token = error.error.token; // Token para cambiar la contraseña
          localStorage.setItem('token', token); // Almacenar el token en el almacenamiento local
          this.router.navigate(['/change-password'], { queryParams: { token: token } }); // Redirigir a la página de cambio de contraseña con el token en los parámetros de la URL
        } else {
          // Otros errores no previstos
          console.error('Error al realizar la solicitud:', error);
          // Mostrar un mensaje de error genérico al usuario
          this.errorMessage = 'Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.';
        }
      });
  }
}
