import {authGuard} from './auth/auth-guard';
import {CreateComponent} from './components/create-component';
import {EditComponent} from './components/edit-component';
import {ListComponent} from './components/list-component';
import {Routes} from '@angular/router';
import {HomeComponent} from './components/home-component';
import {LoginComponent} from './components/login';
import {RegisterComponent} from './components/register';
import {ProfileComponent} from './components/profile';
import {ShowComponent} from './components/show-component';

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
{ path: '**', redirectTo: 'login' },
];
