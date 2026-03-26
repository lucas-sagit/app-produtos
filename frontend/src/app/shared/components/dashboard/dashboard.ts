import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../../services/client.service';
import { PaymentService } from '../../../services/payment.service';
import { ServiceService } from '../../../services/service.service';
import { ProductsService } from '../../../services/products.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  totalClients = 0;
  totalPayments = 0;
  totalServices = 0;
  totalProducts = 0;

  status = {
    total: 0,
    pending: 0,
    paid: 0,
    late: 0
  };

  constructor(
    private clientService: ClientService,
    private paymentService: PaymentService,
    private serviceService: ServiceService,
    private productsService: ProductsService
  ) { }

  ngOnInit(): void {
    this.loadTotals();
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
      next: (payments) => this.totalPayments = payments?.length ?? 0,
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
}
