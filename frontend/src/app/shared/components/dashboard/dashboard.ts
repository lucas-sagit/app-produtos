import { Component, OnInit } from '@angular/core';
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
export class Dashboard implements OnInit {
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

  // Dados do gráfico
  pieChartData: any = {};
  pieChartOptions: any = {};
  pieChartType: 'pie' | 'doughnut' = 'doughnut';
  chartLegend: { label: string; value: string; color: string }[] = [];

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

  loadTotals(): void {
    this.clientService.getClients().subscribe({
      next: (clients) => this.totalClients = clients?.length ?? 0,
      error: (err) => {
        console.error('Erro ao buscar clientes:', err);
        this.totalClients = 0;
      }
    });
    this.paymentService.getPayments().subscribe({
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
    this.serviceService.getServices().subscribe({
      next: (services) => this.totalServices = services?.length ?? 0,
      error: (err) => {
        console.error('Erro ao buscar serviços:', err);
        this.totalServices = 0;
      }
    });
    this.productsService.getProducts().subscribe({
      next: (products) => this.totalProducts = products?.length ?? 0,
      error: (err) => {
        console.error('Erro ao buscar produtos:', err);
        this.totalProducts = 0;
      }
    });
  }

  openNotifications(): void {
    this.paymentService.getNotifications().subscribe({
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
  }

  loadNotifications() {
    this.paymentService.getNotifications().subscribe({
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
  }

  loadCurrentMonthData(): void {
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-11
    const currentYear = now.getFullYear();

    this.paymentService.getPayments().subscribe({
      next: (payments) => {
        // Filtra pagamentos do mês atual
        const currentMonthPayments = payments.filter(p => {
          // Parse da data no formato YYYY-MM-DD
          const dueDateParts = p.due_date.split('-');
          const dueDateYear = parseInt(dueDateParts[0], 10);
          const dueDateMonth = parseInt(dueDateParts[1], 10) - 1; // 0-11
          return dueDateMonth === currentMonth && dueDateYear === currentYear;
        });

        // Calcula valores por status
        const pendingAmount = currentMonthPayments
          .filter(p => p.status === 'pending')
          .reduce((sum, p) => sum + (p.amount || 0), 0);
        const paidAmount = currentMonthPayments
          .filter(p => p.status === 'paid')
          .reduce((sum, p) => sum + (p.amount || 0), 0);
        const lateAmount = currentMonthPayments
          .filter(p => p.status === 'late')
          .reduce((sum, p) => sum + (p.amount || 0), 0);

        // Configura dados do gráfico (valores)
        this.pieChartData = {
          labels: ['Pagos', 'Pendentes', 'Atrasados'],
          datasets: [{
            data: [paidAmount, pendingAmount, lateAmount],
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
            borderWidth: 0
          }]
        };

        // Configura opções do gráfico
        this.pieChartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const value = context.raw;
                  return `R$ ${value.toFixed(2)}`;
                }
              }
            }
          }
        };

        // Configura legenda personalizada
        this.chartLegend = [
          { label: 'Pagos', value: `R$ ${paidAmount.toFixed(2)}`, color: '#10b981' },
          { label: 'Pendentes', value: `R$ ${pendingAmount.toFixed(2)}`, color: '#f59e0b' },
          { label: 'Atrasados', value: `R$ ${lateAmount.toFixed(2)}`, color: '#ef4444' }
        ];
      },
      error: (err) => {
        console.error('Erro ao buscar pagamentos do mês:', err);
      }
    });
  }
}
