import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userData = { email: '', password: '' };
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  login() {
    const url = 'http://127.0.0.1:8000/api/auth/login';

    this.http.post(url, this.userData)
      .subscribe((response: any) => {
        console.log('Respuesta del servidor:', response);
        // Manejo de la respuesta del servidor
        const token = response.token;
        const user = response.user;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Redirigir a la página de bienvenida
        this.router.navigate(['/welcome']);
      }, error => {
        // Manejo de errores aquí
        if (error.status === 401) {
          this.errorMessage = 'Credenciales inválidas';
        } else if (error.status === 402) {
          const token = error.error.token;
          localStorage.setItem('token', token);
          this.router.navigate(['/change-password'], { queryParams: { token: token } });
        } else {
          console.error('Error al realizar la solicitud:', error);
          // Aquí puedes mostrar un mensaje de error genérico al usuario
          this.errorMessage = 'Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.';
        }
      });
  }


}
