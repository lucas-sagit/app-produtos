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
  totalpentending = 0;
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
    this.loadAllFilteredData();
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

    this.loadAllFilteredData();
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

  private getDateRange(): { startDate: Date; endDate: Date } {
    let startDate: Date;
    let endDate: Date;

    if (this.isFiltered && this.dateFilter) {
      if (this.dateFilter.start && this.dateFilter.end) {
        startDate = new Date(this.dateFilter.start);
        endDate = new Date(this.dateFilter.end);
      } else if (Array.isArray(this.dateFilter) && this.dateFilter.length > 0) {
        startDate = new Date(this.dateFilter[0]);
        endDate = new Date(this.dateFilter[this.dateFilter.length - 1]);
      } else {
        const now = new Date();
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      }
    } else {
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    return { startDate, endDate };
  }

  private isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate >= startDate && checkDate <= endDate;
  }

  loadAllFilteredData(): void {
    this.loadClientsCount();
    this.loadServicesCount();
    this.loadPaymentsData();
    this.loadPendingsCount();
  }

  private loadClientsCount(): void {
    const sub = this.clientService.getClients().subscribe({
      next: (clients: any) => {
        if (!this.isFiltered) {
          this.totalClients = clients.length || 0;
        } else {
          const { startDate, endDate } = this.getDateRange();
          const filteredClients = clients.filter((client: any) => {
            if (!client.created_at) return true;
            return this.isDateInRange(new Date(client.created_at), startDate, endDate);
          });
          this.totalClients = filteredClients.length;
        }
        console.log('Total Clientes (filtrado):', this.totalClients);
      },
      error: (err) => {
        console.error('Erro ao buscar clientes:', err);
        this.totalClients = 0;
      }
    });
    this.subscriptions.push(sub);
  }

  private loadServicesCount(): void {
    const sub = this.serviceService.getServices().subscribe({
      next: (services: any) => {
        if (!this.isFiltered) {
          this.totalServices = services.length || 0;
        } else {
          const { startDate, endDate } = this.getDateRange();
          const filteredServices = services.filter((service: any) => {
            if (!service.created_at) return true;
            return this.isDateInRange(new Date(service.created_at), startDate, endDate);
          });
          this.totalServices = filteredServices.length;
        }
        console.log('Total Serviços (filtrado):', this.totalServices);
      },
      error: (err) => {
        console.error('Erro ao buscar serviços:', err);
        this.totalServices = 0;
      }
    });
    this.subscriptions.push(sub);
  }

  private loadPendingsCount(): void {
    const sub = this.paymentService.getDashboardPayments().subscribe({
      next: (payments) => {
        if (!payments || !Array.isArray(payments)) {
          this.totalpentending || 0;
          return;
        }

        const pendingPayments = payments.filter((payment: any) => payment.status === 'pending');
        this.totalpentending = pendingPayments.length;
      },
      error: (err) => {
        console.error('Erro ao buscar pagamentos pendentes:', err);
        this.totalpentending = 0;
      }
    });
    this.subscriptions.push(sub);
  }

  private loadPaymentsData(): void {
    const sub = this.paymentService.getDashboardPayments().subscribe({
      next: (payments) => {
        console.log('Dashboard: Pagamentos recebidos', payments);

        if (!payments || !Array.isArray(payments)) {
          console.warn('Dashboard: Dados inválidos');
          this.initializeEmptyChart();
          return;
        }

        const chartPayments = payments.filter((payment: any) =>
          payment.status === 'paid' ||
          payment.status === 'pending' ||
          payment.status === 'late'
        );

        const paidCount = chartPayments.filter((payment: any) => payment.status === 'paid').length;

        const paidAmount = chartPayments
          .filter((payment: any) => payment.status === 'paid')
          .reduce((total: number, payment: any) => total + Number(payment.amount || 0), 0);

        const pendingAmount = chartPayments
          .filter((payment: any) => payment.status === 'pending')
          .reduce((total: number, payment: any) => total + Number(payment.amount || 0), 0);

        const lateAmount = chartPayments
          .filter((payment: any) => payment.status === 'late')
          .reduce((total: number, payment: any) => total + Number(payment.amount || 0), 0);

          console.log(lateAmount);

        this.totalPayments = paidCount;
        this.status.pending = pendingAmount;
        this.status.paid = paidCount;
        this.status.late = lateAmount;
        this.status.total = chartPayments.length;

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

        console.log('Dashboard: Dados atualizados', {
          paidAmount,
          paidCount,
          pendingAmount,
          lateAmount,
          totalPayments: this.totalPayments
        });
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
    this.totalPayments = 0;
    this.status.pending = 0;
    this.status.paid = 0;
    this.status.late = 0;
    this.status.total = 0;
  }
}
