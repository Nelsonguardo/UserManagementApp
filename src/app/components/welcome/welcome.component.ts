import { Component, OnInit } from '@angular/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { CategoryService } from '../services/categories.service'; 
import { UserService } from '../services/user.service';

interface Category {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  user: any;
  isAdmin!: boolean;

  musicCategoriesControl = new FormControl();
  musicCategories: Category[] = [];
  filteredCategories!: Observable<Category[]>;
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

  constructor(private http: HttpClient, private router: Router, private categoryService: CategoryService , private userService: UserService) { }

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if (userString !== null) {
        this.user = JSON.parse(userString);
        this.isAdmin = this.user.is_admin === 1;

        // Asigna el valor de isAdmin a newUser.is_admin
        this.newUser.is_admin = this.isAdmin;
    } else {
        console.log('User not found in localStorage');
    }

    const token = localStorage.getItem('token');
    if (token) {
      this.categoryService.getAllCategories(token).subscribe(
        (response: Category[]) => { // Corregimos el tipo aquí
          this.musicCategories = response;
          console.log(this.musicCategories);
          this.filteredCategories = this.musicCategoriesControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value))
          );
        },
        (error) => {
          console.error('Error al cargar categorías:', error);
        }
      );
    } else {
      console.error('No se encontró un token en el almacenamiento local.');
    }

    if (token) {
      const userId = this.user.id; // Obtener el ID del usuario de alguna manera
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
          // console.log('Fecha formateada:', this.newUser.date_of_birth);
        },
        (error) => {
          console.error('Error al obtener el usuario:', error);
        }
      );
    } else {
      console.error('No se encontró un token en el almacenamiento local.');
    }
}

private _filter(value: string | Category): Category[] {
  const filterValue = (typeof value === 'string') ? value.toLowerCase() : value.name.toLowerCase();
  
  // Filtrar y ordenar las categorías alfabéticamente por nombre
  return this.musicCategories.filter(category => {
    const categoryName = (typeof category === 'string') ? category : category.name.toLowerCase();
    return categoryName.includes(filterValue);
  }).sort((a, b) => a.name.localeCompare(b.name)); // Ordenar alfabéticamente por nombre
}

  displayFn(category: Category): string {
    return category ? category.name : '';
  }
}