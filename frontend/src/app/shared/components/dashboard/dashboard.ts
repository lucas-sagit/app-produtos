import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../../services/client.service';
import { PaymentService } from '../../../services/payment.service';
import { ServiceService } from '../../../services/service.service';
import { ProductsService } from '../../../services/products.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OpenNotificationComponent } from '../open-notification/openNotification';
import { Chart, registerables } from 'chart.js';
import { BaseChartDirective } from '../../directives/base-chart.directive';
import { Subscription } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIcon,
    MatButtonModule,
    MatBadgeModule,
    MatDialogModule,
    BaseChartDirective
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
    this.loadTotals();
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

  loadTotals(): void {
    let sub = this.clientService.getClients().subscribe({
      next: (clients) => this.totalClients = clients?.length ?? 0,
      error: (err) => {
        console.error('Erro ao buscar clientes:', err);
        this.totalClients = 0;
      }
    });
    this.subscriptions.push(sub);

    sub = this.paymentService.getPayments().subscribe({
      next: (payments) => {
        this.totalPayments = payments?.length ?? 0;
        this.status.total = payments?.length ?? 0;
        this.status.pending = payments?.filter(p => p.status === 'pending')?.length ?? 0;
        this.status.paid = payments?.filter(p => p.status === 'paid')?.length ?? 0;
        this.status.late = payments?.filter(p => p.status === 'late')?.length ?? 0;
      },
      error: (err) => {
        console.error('Erro ao buscar pagamentos:', err);
        this.totalPayments = 0;
      }
    });
    this.subscriptions.push(sub);

    sub = this.serviceService.getServices().subscribe({
      next: (services) => this.totalServices = services?.length ?? 0,
      error: (err) => {
        console.error('Erro ao buscar serviços:', err);
        this.totalServices = 0;
      }
    });
    this.subscriptions.push(sub);

    sub = this.productsService.getProducts().subscribe({
      next: (products) => this.totalProducts = products?.length ?? 0,
      error: (err) => {
        console.error('Erro ao buscar produtos:', err);
        this.totalProducts = 0;
      }
    });
    this.subscriptions.push(sub);
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
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    console.log('Dashboard: Carregando dados do mês', currentMonth, currentYear);

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
            if (p.status !== 'late') return false;
            if (!p.due_date) return false;
            const date = new Date(p.due_date);
            return date.getMonth() === currentMonth &&
              date.getFullYear() === currentYear;
          })
          .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

        console.log('Dashboard: Valores calculados', { paidAmount, pendingAmount, lateAmount });

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

        console.log('Dashboard: Dados do gráfico atualizados', this.pieChartData);
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
