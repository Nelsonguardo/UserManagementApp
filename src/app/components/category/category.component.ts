// usuario.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CategoryService } from '../services/categories.service'; // Cambio de UserService a CategoryService
import { MatSnackBar } from '@angular/material/snack-bar';



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
    private categoryService: CategoryService, // Cambio de UserService a CategoryService
    private snackBar: MatSnackBar
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
          this.snackBar.open('Error al cargar categoría', 'Cerrar', {
            duration: 3000,
          });
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
          this.snackBar.open('Error al optener categoría', 'Cerrar', {
            duration: 3000,
          });
        }
      );
    } else {
      console.error('No se encontró un token en el almacenamiento local.');
    }
  }

  submitForm() {
    if (this.validarCamposRequeridos()) {
      if (this.isEditing) {
        const categoryId = this.newCategory.id;
        const token = localStorage.getItem('token');
        if (token) {
          this.categoryService.updateCategory(categoryId, this.newCategory, token).subscribe(
            (response) => {
              this.snackBar.open('Categoría actualizada correctamente', 'Cerrar', {
                duration: 3000, // Duración en milisegundos
              });
              this.showForm = false;
              this.clearForm();
              this.loadCategorias();
            },
            (error) => {
              this.snackBar.open('Error al actualizar categoría', 'Cerrar', {
                duration: 3000,
              });
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
              this.snackBar.open('Categoría creada correctamente', 'Cerrar', {
                duration: 3000, // Duración en milisegundos
              });
              this.categorias.push(this.newCategory);
              this.showForm = false;
              this.clearForm();
              this.loadCategorias();
            },
            (error) => {
              this.snackBar.open('Error al crear categoría', 'Cerrar', {
                duration: 3000,
              });
            }
          );
        } else {
          console.error('No se encontró un token en el almacenamiento local.');
        }
      }
    }
  }

  eliminarCategoria(categoryId: number) {
    const token = localStorage.getItem('token');
    if (token) {
      this.categoryService.deleteCategory(categoryId, token).subscribe(
        () => {
          this.snackBar.open('Categoría eliminada correctamente', 'Cerrar', {
            duration: 3000, // Duración en milisegundos
          });
          this.categorias = this.categorias.filter(category => category.id !== categoryId);
        },
        (error) => {
          this.snackBar.open('Error al eliminar categoría', 'Cerrar', {
            duration: 3000,
          });
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
  openSnackBar(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 2000, // Duración en milisegundos
    });
  }

  validarCamposRequeridos() {
    let camposFaltantes = [];
  
    if (!this.newCategory.name) {
      camposFaltantes.push('Nombre de categoría');
      this.openSnackBar('El nombre de la categoría es obligatorio');
      return false;
    }
    return true;
  }
}
