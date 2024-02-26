import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  newPassword: string = '';
  confirmPassword: string = '';
  currentPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  // Método para cambiar la contraseña
  changePassword() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']); // Redirige a la página de inicio de sesión si no hay token
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }
  
    // Validar la nueva contraseña según los criterios requeridos
    if (!this.validarNuevaContrasena(this.newPassword)) {
      this.errorMessage = 'La nueva contraseña debe tener al menos 8 caracteres, un número, una letra mayúscula y un carácter especial.';
      return;
    }
    
    const url = 'http://127.0.0.1:8000/api/auth/change-password';
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
    const body = {
      current_password: this.currentPassword,
      new_password: this.newPassword,
      new_password_confirmation: this.confirmPassword
    };

    this.http.post(url, body, { headers })
      .subscribe((response: any) => {
        console.log('Respuesta del servidor:', response);
        // Manejo de la respuesta del servidor
        this.successMessage = 'Contraseña cambiada con éxito.';
        this.errorMessage = ''; // Limpiar el mensaje de error si hubiera alguno
        // Redirige a la página de inicio de sesión después de cambiar la contraseña
        this.logout();
        this.router.navigate(['/login']);
      }, error => {
        console.error('Error al realizar la solicitud:', error);
        // Manejo de errores aquí
        if (error.status === 401) {
          this.errorMessage = 'La contraseña actual es incorrecta.';
        } else {
          this.errorMessage = 'Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente más tarde.';
        }
        // Limpia el mensaje de éxito si se produjo un error
        this.successMessage = '';
      });
  }

  // Método para cerrar sesión
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

  // Método para validar la nueva contraseña
  validarNuevaContrasena(contrasena: string): boolean {
    // Longitud mínima 8, al menos un número, una letra mayúscula, un carácter especial
    const contrasenaRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
    return contrasenaRegex.test(contrasena);
  }
}
