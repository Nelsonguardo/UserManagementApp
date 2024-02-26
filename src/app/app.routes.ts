import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { UsuarioComponent } from './components/user/user.component'; 
import { CategoryComponent } from './components/category/category.component';
import { AuthGuard } from './auth.guard'; // Importa el guardia de ruta

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'change-password', component: ChangePasswordComponent },
    { path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard] }, // Protege esta ruta
    { path: 'usuarios', component: UsuarioComponent, canActivate: [AuthGuard] }, // Protege esta ruta
    { path: 'categorias', component: CategoryComponent, canActivate: [AuthGuard] }, // Protege esta ruta
    // Otras rutas de tu aplicación
];
