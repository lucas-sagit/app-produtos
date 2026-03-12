import { Routes } from '@angular/router';
import { ProductsComponent } from './shared/components/produtct/products.component';
import { ListComponent } from './shared/components/list/list.component';
import { UserComponent } from './shared/components/user/user.component';

export const routes: Routes = [
  { path: '', redirectTo: 'user', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent },
  { path: 'list', component: ListComponent },
  { path: 'user', component: UserComponent }
];
