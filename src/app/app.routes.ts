import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { UsuarioComponent } from './components/user/user.component'; // Importa el componente de usuario
import { CategoryComponent } from './components/category/category.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'change-password', component: ChangePasswordComponent },
    { path: 'welcome', component: WelcomeComponent },
    { path: 'usuarios', component: UsuarioComponent },
    { path: 'categorias', component: CategoryComponent},
    // Otras rutas de tu aplicación
];
