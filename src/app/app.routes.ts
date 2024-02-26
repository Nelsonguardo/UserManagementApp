import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { UsuarioComponent } from './components/user/user.component'; 
import { CategoryComponent } from './components/category/category.component';
import { AuthGuard } from './auth.guard';

// Definición de las rutas de la aplicación
export const routes: Routes = [
    // Rutas públicas
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'change-password', component: ChangePasswordComponent },

    // Rutas protegidas por autenticación
    { path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard] },
    { path: 'usuarios', component: UsuarioComponent, canActivate: [AuthGuard] },
    { path: 'categorias', component: CategoryComponent, canActivate: [AuthGuard] },

    // Otras rutas de tu aplicación
];
