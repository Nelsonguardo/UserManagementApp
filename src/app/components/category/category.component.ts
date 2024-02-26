// usuario.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CategoryService } from '../services/categories.service'; // Cambio de UserService a CategoryService

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description', 'actions']; // Actualización de los nombres de las columnas
  categorias: any[] = [];
  showForm: boolean = false;
  isEditing: boolean = false;
  newCategory: any = {
    name: '',
    description: ''
  };
  
  constructor(
    private http: HttpClient,
    private categoryService: CategoryService // Cambio de UserService a CategoryService
  ) { }

  ngOnInit(): void {
    this.loadCategorias(); // Cambio de loadUsuarios a loadCategorias
  }

  loadCategorias() {
    const token = localStorage.getItem('token');
    if (token) {
      this.categoryService.getAllCategories(token).subscribe(
        (response) => {
          this.categorias = response;
          console.log(this.categorias);
        },
        (error) => {
          console.error('Error al cargar categorías:', error);
        }
      );
    } else {
      console.error('No se encontró un token en el almacenamiento local.');
    }
  }

  openCrearCategoriaModal() {
    console.log('Open modal');
    this.showForm = true;
    this.isEditing = false;
    this.clearForm();
  }

  openEditarCategoriaModal(categoryId: number) {
    //console.log('Open modal ' + categoryId);
    this.showForm = true;
    this.isEditing = true;
    
    const token = localStorage.getItem('token');
    if (token) {
      this.categoryService.getCategory(categoryId, token).subscribe(
        (category) => {
          this.newCategory = category;
        },
        (error) => {
          console.error('Error al obtener la categoría:', error);
        }
      );
    } else {
      console.error('No se encontró un token en el almacenamiento local.');
    }
  }
  
  submitForm() {
    console.log('Submit form');
    if (this.isEditing) {
      const categoryId = this.newCategory.id;
      const token = localStorage.getItem('token');
      if (token) {
        this.categoryService.updateCategory(categoryId, this.newCategory, token).subscribe(
          (response) => {
            console.log('Categoría actualizada exitosamente:', response);
            this.showForm = false;
            this.clearForm();
            this.loadCategorias();
          },
          (error) => {
            console.error('Error al actualizar categoría:', error);
          }
        );
      } else {
        console.error('No se encontró un token en el almacenamiento local.');
      }
    } else {
      const token = localStorage.getItem('token');
      if (token) {
        this.categoryService.createCategory(this.newCategory, token).subscribe(
          (response) => {
            console.log('Categoría creada exitosamente:', response);
            this.categorias.push(this.newCategory);
            this.showForm = false;
            this.clearForm();
            this.loadCategorias();
          },
          (error) => {
            console.error('Error al crear categoría:', error);
          }
        );
      } else {
        console.error('No se encontró un token en el almacenamiento local.');
      }
    }
  }
  
  eliminarCategoria(categoryId: number) {
    const token = localStorage.getItem('token');
    if (token) {
      this.categoryService.deleteCategory(categoryId, token).subscribe(
        () => {
          this.categorias = this.categorias.filter(category => category.id !== categoryId);
        },
        (error) => {
          console.error('Error al eliminar categoría:', error);
        }
      );
    } else {
      console.error('No se encontró un token en el almacenamiento local.');
    }
  }

  closeForm() {
    this.showForm = false;
    this.clearForm();
  }

  clearForm() {
    this.newCategory = {
      name: '',
      description: ''
    };
  }
}
