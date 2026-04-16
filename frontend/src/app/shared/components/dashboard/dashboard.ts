import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../services/client.service';
import { PaymentService } from '../../../services/payment.service';
import { ServiceService } from '../../../services/service.service';
import { ProductsService } from '../../../services/products.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OpenNotificationComponent } from '../open-notification/openNotification';
import { Chart, registerables } from 'chart.js';
import { BaseChartDirective } from '../../directives/base-chart.directive';
import { Subscription } from 'rxjs';
import { DateComponent } from '../date/date';


Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    MatIcon,
    MatButtonModule,
    MatBadgeModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    BaseChartDirective,
    DateComponent
  ],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',

})
export class Dashboard implements OnInit, OnDestroy {
  totalClients = 0;
  totalPayments = 0;
  totalServices = 0;
  totalProducts = 0;
  notificationsCount = 0;

  notifications: any[] = [];

  status = {
    total: 0,
    pending: 0,
    paid: 0,
    late: 0
  };

  // Filtro por data
  // selectedDate: Date | null = null;
  dateFilter: any = null;
  allPayments: any[] = [];
  isFiltered = false;

  // Dados do gráfico - inicializado com estrutura vazia
  pieChartData: any = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
      borderWidth: 0
    }]
  };
  pieChartOptions: any = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      }
    }
  };
  pieChartType: 'pie' | 'doughnut' = 'doughnut';
  chartLegend: { label: string; value: number; color: string }[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private clientService: ClientService,
    private paymentService: PaymentService,
    private serviceService: ServiceService,
    private productsService: ProductsService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadNotifications();
    this.loadCurrentMonthData();
  }

  logout(): void {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onDatesChange(filter: any) {
  console.log('Filtro recebido:', filter);

  this.dateFilter = filter;
  this.isFiltered = true;

  this.loadCurrentMonthData();
}

  openNotifications(): void {
    const sub = this.paymentService.getNotifications().subscribe({
      next: (res) => {
        this.dialog.open(OpenNotificationComponent, {
          width: '500px',
          data: res.data
        });
      },
      error: (err) => {
        console.error('Erro ao carregar notificações:', err);
      }
    });
    this.subscriptions.push(sub);
  }

  loadNotifications() {
    const sub = this.paymentService.getNotifications().subscribe({
      next: (res) => {
        this.notificationsCount = res.count;
        this.notifications = res.data;
      },
      error: (err) => {
        console.error('Erro ao carregar notificações:', err);
        this.notificationsCount = 0;
        this.notifications = [];
      }
    });
    this.subscriptions.push(sub);
  }

  loadCurrentMonthData(): void {
    const now = this.selectedDate || new Date();
    let currentMonth = now.getMonth();
    let currentYear = now.getFullYear();

    console.log('Dashboard: Carregando dados do período mensal', { currentMonth: currentMonth + 1, currentYear });

    const sub = this.paymentService.getDashboardPayments().subscribe({
      next: (payments) => {
        console.log('Dashboard: Pagamentos recebidos', payments);

        if (!payments || !Array.isArray(payments)) {
          console.warn('Dashboard: Dados inválidos');
          this.initializeEmptyChart();
          return;
        }

        // 🔥 Pagamentos PAGOS (usa paid_at)
        const paidAmount = payments
          .filter(p => {
            if (!p.paid_at) return false;
            const date = new Date(p.paid_at);
            return date.getMonth() === currentMonth &&
              date.getFullYear() === currentYear;
          })
          .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

        // 🔥 Pendentes (usa due_date)
        const pendingAmount = payments
          .filter(p => {
            if (p.status !== 'pending') return false;
            if (!p.due_date) return false;
            const date = new Date(p.due_date);
            return date.getMonth() === currentMonth &&
              date.getFullYear() === currentYear;
          })
          .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

        const lateAmount = payments
          .filter(p => {
            if (!p.due_date) return false;

            const dueDate = new Date(p.due_date);
            const today = new Date();

            // 🔥 Regra correta: venceu e não foi pago
            return (
              dueDate < today &&
              p.status !== 'paid'
            );
          })
          .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

        this.pieChartData = {
          labels: ['Pagos', 'Pendentes', 'Atrasados'],
          datasets: [{
            data: [paidAmount, pendingAmount, lateAmount],
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
            borderWidth: 0
          }]
        };

        this.chartLegend = [
          { label: 'Pagos', value: paidAmount, color: '#10b981' },
          { label: 'Pendentes', value: pendingAmount, color: '#f59e0b' },
          { label: 'Atrasados', value: lateAmount, color: '#ef4444' }
        ];
      },

      error: (err) => {
        console.error('Erro ao buscar dados do dashboard:', err);
        this.initializeEmptyChart();
      }
    });
    this.subscriptions.push(sub);
  }

  initializeEmptyChart(): void {
    this.pieChartData = {
      labels: ['Pagos', 'Pendentes', 'Atrasados'],
      datasets: [{
        data: [0, 0, 0],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0
      }]
    };
    this.chartLegend = [
      { label: 'Pagos', value: 0, color: '#10b981' },
      { label: 'Pendentes', value: 0, color: '#f59e0b' },
      { label: 'Atrasados', value: 0, color: '#ef4444' }
    ];
  }
}
