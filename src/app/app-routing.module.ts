import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from './guards/authentication.guard';
import { AssetsComponent } from './pages/assets/assets.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'assets', component: AssetsComponent, canActivate: [AuthenticationGuard]},
  {path: '', redirectTo: '/assets', pathMatch: 'full'},
  {path: '**', redirectTo: '/assets'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
