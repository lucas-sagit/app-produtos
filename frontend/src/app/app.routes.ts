import { Routes } from '@angular/router';
import { ProductsComponent } from './shared/components/produtct/products.component';
import { ListComponent } from './shared/components/list/list.component';
import { LoginComponent } from './shared/components/login/login.component';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent },
  { path: 'list', component: ListComponent },
  { path: 'login', component: LoginComponent }
];
