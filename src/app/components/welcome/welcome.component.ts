import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  user: any;
  isAdmin!: boolean;

  musicCategoriesControl = new FormControl();
  musicCategories: string[] = ['Rock', 'Pop', 'Jazz', 'Electrónica']; // Define tus categorías aquí
  filteredCategories: Observable<string[]> = new Observable<string[]>(/* initialize with default value here */);

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Recuperar información del usuario desde el almacenamiento local
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      this.user = JSON.parse(userString);
      this.isAdmin = this.user.is_admin === 1; // Verificar si el usuario es administrador
    } else {
      // Handle the case where 'user' is not found in localStorage
      console.log('User not found in localStorage');
    }

    // Configurar el filtrado para el campo de autocompletar
    this.filteredCategories = this.musicCategoriesControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.musicCategories.filter(category => category.toLowerCase().includes(filterValue));
  }
}
