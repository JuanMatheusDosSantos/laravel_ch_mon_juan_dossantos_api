import {authGuard} from './auth/auth-guard';
import {Routes} from '@angular/router';
import {HomeComponent} from './home/home';
import {LoginComponent} from './pages/login/login';
import {ProfileComponent} from './pages/profile/profile';
import {ShowComponent} from './views/show-component/show-component';
import {ListComponent} from './views/list-component/list-component';
import {RegisterComponent} from './pages/register/register';
import {CreateComponent} from './views/create-component/create-component';
import {EditComponent} from './views/edit-component/edit-component';

export const routes: Routes = [

{ path: '', component: HomeComponent },
// Rutas de petitions
{ path: 'petitions', component: ListComponent },
{ path: 'petitions/create', component: CreateComponent, canActivate: [authGuard] },
{ path: 'petitions/edit/:id', component: EditComponent, canActivate: [authGuard] },
{ path: 'petitions/:id', component: ShowComponent}, // Detalle público
// Auth
{ path: 'login', component: LoginComponent },
{ path: 'register', component: RegisterComponent },
{ path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
// Wildcard: Cualquier ruta no encontrada va al login (o a 404)
{ path: '**', component: HomeComponent, pathMatch: 'full'},];
