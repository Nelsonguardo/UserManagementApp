// usuario.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UsuarioComponent implements OnInit {
  displayedColumns: string[] = ['email', 'name', 'last_name', 'actions'];
  usuarios: any[] = [];
  showForm: boolean = false; // Variable para mostrar/ocultar el formulario
  isEditing: boolean = false; // Variable para indicar si se está editando un usuario
  newUser: any = {
    email: '',
    name: '',
    last_name:'',
    mobile: '',
    id_number: '',
    date_of_birth: '',
    city_id: '',
    city_code: '',
    department_id: '',
    country_id:'',
    password: '',
    password_confirmation: ''
}
  
  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios() {
    const token = localStorage.getItem('token');
    if (token) {
      this.userService.getAllUsers(token).subscribe(
        (response) => {
          this.usuarios = response;
          console.log(this.usuarios);
        },
        (error) => {
          console.error('Error al cargar usuarios:', error);
        }
      );
    } else {
      console.error('No se encontró un token en el almacenamiento local.');
    }
  }

  openCrearUsuarioModal() {
    console.log('Open modal');
    this.showForm = true; // Mostrar el formulario al abrir el modal de creación
    this.isEditing = false; // Establecer que no se está editando
    this.clearForm();
  }

  openEditarUsuarioModal(userId: number) {
    console.log('Open modal ' + userId);
    this.showForm = true; // Mostrar el formulario al abrir el modal de edición
    this.isEditing = true; // Establecer que se está editando
    
    const token = localStorage.getItem('token');
    if (token) {
      this.userService.getUser(userId, token).subscribe(
        (user) => {
          // Obtener solo la parte de la fecha sin la marca de tiempo y la zona horaria
          const dbDate = user.date_of_birth.split('T')[0];
          
          // Asignar solo la fecha formateada al usuario
          this.newUser.date_of_birth = dbDate;
          // Mantener el resto de los datos del usuario en this.newUser
          delete user.date_of_birth; // Eliminar la fecha de nacimiento para evitar duplicados
          Object.assign(this.newUser, user); // Asignar el resto de los datos del usuario a this.newUser
          
          // Comprobación en la consola para asegurarse de que la fecha esté formateada correctamente
          //console.log('Fecha formateada:', this.newUser.date_of_birth);
        },
        (error) => {
          console.error('Error al obtener el usuario:', error);
        }
      );
    } else {
      console.error('No se encontró un token en el almacenamiento local.');
    }
  }
  

  submitForm() {
    // Lógica para enviar el formulario (crear o editar usuario)
    console.log('Submit form');
    if (this.isEditing) {
      // Si se está editando, llamar al servicio de actualización
      const userId = this.newUser.id;
      const token = localStorage.getItem('token');
      if (token) {
        // Cambiar el formato de la fecha antes de enviarla al servidor
        const formattedDate = new Date(this.newUser.date_of_birth).toISOString().split('T')[0];
        this.newUser.date_of_birth = formattedDate;
  
        this.userService.updateUser(userId, this.newUser, token).subscribe(
          (response) => {
            console.log('Usuario actualizado exitosamente:', response);
            console.log('Usuario actualizado:', this.newUser);
            // Lógica adicional después de la actualización
            this.showForm = false; // Ocultar el formulario después de enviar
            this.clearForm();
            this.loadUsuarios();
          },
          (error) => {
            console.error('Error al actualizar usuario:', error);
          }
        );
      } else {
        console.error('No se encontró un token en el almacenamiento local.');
      }
    } else {
      // Si no se está editando, significa que se está creando un nuevo usuario
      const token = localStorage.getItem('token');
      if (token) {
        const formattedDate = new Date(this.newUser.date_of_birth).toISOString().split('T')[0];
        this.newUser.date_of_birth = formattedDate;
        console.log(this.newUser);
  
        this.userService.createUser(this.newUser, token).subscribe(
          (response) => {
            console.log('Usuario creado exitosamente:', response);
            // Lógica adicional después de la creación
            console.log('Usuario creado:', this.newUser);
            this.usuarios.push(this.newUser);
            this.showForm = false; // Ocultar el formulario después de enviar
            this.clearForm();
            this.loadUsuarios(); // Recargar la lista de usuarios
          },
          (error) => {
            console.error('Error al crear usuario:', error);
          }
        );
      } else {
        console.error('No se encontró un token en el almacenamiento local.');
      }
    }
  }
  

  eliminarUsuario(userId: number) {
    const token = localStorage.getItem('token');
    if (token) {
      this.userService.deleteUser(userId, token).subscribe(
        () => {
          this.usuarios = this.usuarios.filter(user => user.id !== userId);
        },
        (error) => {
          console.error('Error al eliminar usuario:', error);
        }
      );
    } else {
      console.error('No se encontró un token en el almacenamiento local.');
    }
  }

  closeForm() {
    this.showForm = false; // Ocultar el formulario
    this.clearForm(); // Limpiar el formulario
}

clearForm() {
    // Restablecer el objeto newUser a un estado inicial vacío
    this.newUser = {
        email: '',
        name: '',
        last_name: '',
        mobile: '',
        id_number: '',
        date_of_birth: '',
        city_code: null,
        city_id: null,
        department_id: null,
        country_id: null,
        password: '',
        password_confirmation: ''
    };
}
}
