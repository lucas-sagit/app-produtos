import { Routes } from '@angular/router';
import { ProductsComponent } from './shared/components/produtct/products.component';
import { ListComponent } from './shared/components/list/list.component';
import { LoginComponent } from './shared/components/login/login.component';
import { Dashboard } from './shared/components/dashboard/dashboard';
import { ClientsComponent } from './shared/components/clients/clients';
import { PaymentsComponent } from './shared/components/payments/payments';
import { ServicesComponent } from './shared/components/service/services';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'clientes', component: ClientsComponent },
  { path: 'pagamentos', component: PaymentsComponent },
  { path: 'servicos', component: ServicesComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'list', component: ListComponent },
  { path: 'login', component: LoginComponent }
];
