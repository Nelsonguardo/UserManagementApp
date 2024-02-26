import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppComponent } from './app.component'; // Asegúrate de importar AppComponent desde el archivo correcto
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { UsuarioComponent } from './components/user/user.component';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import {MatTableModule} from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CategoryComponent } from './components/category/category.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [
        LoginComponent,
        ChangePasswordComponent, 
        UsuarioComponent,
        WelcomeComponent,
        NavbarComponent,
        CategoryComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        RouterModule.forRoot(routes),
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        CommonModule,
        MatTableModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        BrowserAnimationsModule
    ],
    providers: [],
})
export class AppModule {
    ngDoBootstrap(app: import('@angular/core').ApplicationRef) {
        app.bootstrap(AppComponent);
    }
}