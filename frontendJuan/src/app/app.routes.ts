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
import {adminGuard} from './auth/admin-guard';
import {PanelComponent} from './admin/panel/panel';
import {Mypetitions} from './views/mypetitions/mypetitions';
import {Signedpetitions} from './views/signedpetitions/signedpetitions';
import {AdminShow} from './admin/adminshow/adminshow';
import {Edit} from './admin/edit/edit';
import {Users} from './admin/users/users';
import {Showuser} from './admin/showuser/showuser';
import {Editouser} from './admin/editouser/editouser';

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

  // RUTA DEL PANEL DE ADMINISTRACIÓN (Debe ir antes del comodín **)
  {
    path: 'admin',
    component: PanelComponent, // Más directo, ya que lo importaste arriba
    canActivate: [adminGuard]
  },
  {
    path: 'admin/petitions/:id',
    component: AdminShow, // Más directo, ya que lo importaste arriba
    canActivate: [adminGuard]
  },
  {
    path: 'admin/petitions/edit/:id',
    component: Edit, // Más directo, ya que lo importaste arriba
    canActivate: [adminGuard]
  },
  {
    path: 'admin/users',
    component: Users, // Más directo, ya que lo importaste arriba
    canActivate: [adminGuard]
  },
  {
    path: 'admin/users/:id',
    component: Showuser, // Más directo, ya que lo importaste arriba
    canActivate: [adminGuard]
  },
  {
    path: 'admin/users/edit/:id',
    component: Editouser, // Más directo, ya que lo importaste arriba
    canActivate: [adminGuard]
  },
  {path:"mypetitions",component:Mypetitions, canActivate:[authGuard]},
  {path:"signedpetitions",component:Signedpetitions, canActivate:[authGuard]},

{ path: '**', component: HomeComponent, pathMatch: 'full'},];
