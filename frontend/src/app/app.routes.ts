import { Routes } from '@angular/router';
import { ProductsComponent } from './shared/components/produtct/products.component';
import { ListComponent } from './shared/components/list/list.component';
import { LoginComponent } from './shared/components/login/login.component';
import { Dashboard } from './shared/components/dashboard/dashboard';
import { ClientsComponent } from './shared/components/clients/clients';
import { PaymentsComponent } from './shared/components/payments/payments';
import { ServicesComponent } from './shared/components/service/services';
import { DateComponent } from './shared/components/date/date';
import { AuthGuard } from './shared/services/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard], runGuardsAndResolvers: 'always'
 },

  { path: 'clientes', component: ClientsComponent, canActivate: [AuthGuard] },
  { path: 'pagamentos', component: PaymentsComponent, canActivate: [AuthGuard] },
  { path: 'servicos', component: ServicesComponent, canActivate: [AuthGuard] },
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] },
  { path: 'list', component: ListComponent, canActivate: [AuthGuard] },
  { path: 'date', component: DateComponent, canActivate: [AuthGuard] }
]


