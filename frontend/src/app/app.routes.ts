import { Routes } from '@angular/router';
import { ProductsComponent } from './shared/components/produtct/products.component';
import { ListComponent } from './shared/components/list/list.component';
import { LoginComponent } from './shared/components/login/login.component';
import { Dashboard } from './shared/components/dashboard/dashboard';
import { ClientsComponent } from './shared/components/clients/clients';
import { PaymentsComponent } from './shared/components/payments/payments';
import { ServicesComponent } from './shared/components/service/services';
import { AuthGuard } from './guards/auth-guard';
import { GoBack } from './shared/components/go_Back/goBack';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, data: { hideGoBack: true} },
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard], data: { hideGoBack: true} },

  { path: 'clientes', component: ClientsComponent, canActivate: [AuthGuard] },
  { path: 'pagamentos', component: PaymentsComponent, canActivate: [AuthGuard] },
  { path: 'servicos', component: ServicesComponent, canActivate: [AuthGuard] },
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] },
  { path: 'list', component: ListComponent, canActivate: [AuthGuard] }
]

