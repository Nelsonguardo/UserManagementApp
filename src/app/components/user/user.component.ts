// usuario.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { userData } from './data';


@Component({
  selector: 'app-usuario',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UsuarioComponent implements OnInit {
  displayedColumns: string[] = ['email', 'name', 'last_name', 'actions'];
  countries: any[] = userData.countries;
  selectedCountryDepartments: any[] = [];
  selectedDepartmentCities: any[] = [];
  usuarios: any[] = [];
  showForm: boolean = false; // Variable para mostrar/ocultar el formulario
  isEditing: boolean = false; // Variable para indicar si se está editando un usuario
  newUser: any = {
    email: '',
    name: '',
    last_name: '',
    mobile: '',
    id_number: '',
    date_of_birth: '',
    city_id: '',
    city_code: '',
    department_id: '',
    country_id: '',
    password: '',
    password_confirmation: ''
  }

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private snackBar: MatSnackBar,

  ) { }

  ngOnInit(): void {
    this.loadUsuarios();
    this.clearFilters();
  }

  loadUsuarios() {
    const token = localStorage.getItem('token');
    if (token) {
      this.userService.getAllUsers(token).subscribe(
        (response) => {
          this.usuarios = response;
          this.clearFilters();
          //console.log(this.usuarios);
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
    this.clearFilters();
    this.showForm = true; // Mostrar el formulario al abrir el modal de creación
    this.isEditing = false; // Establecer que no se está editando
    this.clearForm();
  }

  openEditarUsuarioModal(userId: number) {
    this.clearFilters();
    //console.log('Open modal ' + userId);
    this.showForm = true; // Mostrar el formulario al abrir el modal de edición
    this.isEditing = true; // Establecer que se está editando

    const token = localStorage.getItem('token');
    if (token) {
      this.userService.getUser(userId, token).subscribe(
        (user) => {
          const dbDate = user.date_of_birth.split('T')[0];
          this.newUser.date_of_birth = dbDate;
          delete user.date_of_birth; // Eliminar la fecha de nacimiento para evitar duplicados
          Object.assign(this.newUser, user); // Asignar el resto de los datos del usuario a this.newUser
          // Asignar el resto de los datos del usuario a this.newUser
          delete user.date_of_birth;
          Object.assign(this.newUser, user);

          // Asignar los valores seleccionados en los desplegables
          this.selectedCountryDepartments = this.countries.find(country => country.id === Number(this.newUser.country_id)).departamentos;
          this.selectedDepartmentCities = this.selectedCountryDepartments.find(department => department.id === Number(this.newUser.department_id)).ciudades;


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

    if (this.validarCamposRequeridos()) {
      // Lógica para enviar el formulario (crear o editar usuario)
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
              this.snackBar.open('Usuario actualizado correctamente', 'Cerrar', {
                duration: 3000, // Duración en milisegundos
              });
              // Lógica adicional después de la actualización
              this.clearFilters();
              this.showForm = false; // Ocultar el formulario después de enviar
              this.clearForm();
              this.loadUsuarios();
            },
            (error) => {
              this.snackBar.open('Error al actualizar usuario', 'Cerrar', {
                duration: 3000,
              });
              if (error.status === 422) {
                this.snackBar.open('Email ya registrado', 'Cerrar', {
                  duration: 3000,
                });

              }

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
              // Lógica adicional después de la creación
              this.snackBar.open('Usuario creado correctamente', 'Cerrar', {
                duration: 3000,
              });
              this.clearFilters();
              this.usuarios.push(this.newUser);
              this.showForm = false; // Ocultar el formulario después de enviar
              this.clearForm();
              this.loadUsuarios(); // Recargar la lista de usuarios
            },
            (error) => {
              this.snackBar.open('Error al crear usuario', 'Cerrar', {
                duration: 3000,
              });

              if (error.status === 422) {
                this.snackBar.open('Email ya registrado', 'Cerrar', {
                  duration: 3000,
                });

              }
            }
          );
        } else {
          console.error('No se encontró un token en el almacenamiento local.');
        }
      }
    }

  }

  eliminarUsuario(userId: number) {
    const token = localStorage.getItem('token');
    if (token) {
      this.userService.deleteUser(userId, token).subscribe(
        () => {
          this.snackBar.open('Usuario eliminado correctamente', 'Cerrar', {
            duration: 3000,
          });
          this.usuarios = this.usuarios.filter(user => user.id !== userId);
        },
        (error) => {
          this.snackBar.open('Error al eliminar usuario', 'Cerrar', {
            duration: 3000,
          });
        }
      );
    } else {
      console.error('No se encontró un token en el almacenamiento local.');
    }
  }

  closeForm() {
    this.clearFilters();
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
  validarCamposRequeridos() {
    let camposFaltantes = [];

    if (!this.newUser.email) {
      camposFaltantes.push('Email');
    }

    if (!this.newUser.name) {
      camposFaltantes.push('Nombre');
    }

    if (!this.newUser.last_name) {
      camposFaltantes.push('Apellido');
    }

    if (!this.newUser.id_number) {
      camposFaltantes.push('Identificación');
    }

    if (!this.newUser.date_of_birth) {
      camposFaltantes.push('Fecha de Nacimiento');
    } else if (this.calcularEdad(this.newUser.date_of_birth) < 18) {
      this.openSnackBar('Debe ser mayor de 18 años');
      return false;
    }

    if (!this.newUser.city_code) {
      camposFaltantes.push('Código Ciudad');
    }

    if (this.newUser.mobile && this.newUser.mobile.length !== 10) {
      this.openSnackBar('El # de celular debe tener 10 caracteres');
      return false;
    }

    if (this.newUser.password !== this.newUser.password_confirmation) {
      this.openSnackBar('Las contraseñas no coinciden');
      return false;
    }

    if (!this.isEditing) {
      if (!this.newUser.password) {
        camposFaltantes.push('Contraseña');
      }
      if (!this.newUser.password_confirmation) {
        camposFaltantes.push('Confirmar Contraseña');
      }
    }
    if (this.newUser.password && !this.validarContrasena(this.newUser.password)) {
      this.openSnackBar('La contraseña debe tener al menos 8 caracteres, un número, una letra mayúscula y un carácter especial');
      return false;
    }

    if (camposFaltantes.length > 0) {
      const message = `Los siguientes campos son requeridos: ${camposFaltantes.join(', ')}`;
      this.openSnackBar(message);
      return false;
    }

    if (this.newUser.email && !this.validarFormatoEmail(this.newUser.email)) {
      this.openSnackBar('El formato del email no es válido');
      return false;
    }

    return true;
  }

  validarFormatoEmail(email: string): boolean {
    // Expresión regular para validar formato de email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  calcularEdad(fechaNacimiento: Date): number {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    return edad;
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 2000, // Duración en milisegundos
    });
  }
  validarSoloNumeros(event: any) {
    const pattern = /^[0-9]*$/;
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  }
  validarContrasena(contrasena: string): boolean {
    // Longitud mínima 8, al menos un número, una letra mayúscula, un carácter especial
    const contrasenaRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
    return contrasenaRegex.test(contrasena);
  }

  onCountryChange() {
    const selectedCountry = this.countries.find(country => country.id === Number(this.newUser.country_id));
    if (selectedCountry) {
      this.selectedCountryDepartments = selectedCountry.departamentos;
      this.selectedDepartmentCities = [];
      this.newUser.department_id = '';
      this.newUser.city_id = '';
    }
  }

  // Método para manejar el cambio de departamento
  onDepartmentChange() {
    const selectedDepartment = this.selectedCountryDepartments.find(department => department.id === Number(this.newUser.department_id));
    if (selectedDepartment) {
      this.selectedDepartmentCities = selectedDepartment.ciudades;
      this.newUser.city_id = '';
    }
  }

  clearFilters() {
    this.selectedCountryDepartments = [];
    this.selectedDepartmentCities = [];
    this.newUser.country_id = '';
    this.newUser.department_id = '';
    this.newUser.city_id = '';
  }
  capitalizeName() {
    this.newUser.name = this.capitalizeFirstLetter(this.newUser.name);
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}
