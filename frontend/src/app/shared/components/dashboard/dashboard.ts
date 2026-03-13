import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../../services/client.service';
import { PaymentService } from '../../../services/payment.service';
import { ServiceService } from '../../../services/service.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  totalClients = 0;
  totalPayments = 0;
  totalServices = 0;

  constructor(
    private clientService: ClientService,
    private paymentService: PaymentService,
    private serviceService: ServiceService
  ) {}

  ngOnInit(): void {
    this.loadTotals();
  }

  loadTotals(): void {
    this.clientService.getClients().subscribe(clients => this.totalClients = clients.length);
    this.paymentService.getPayments().subscribe(payments => this.totalPayments = payments.length);
    this.serviceService.getServices().subscribe(services => this.totalServices = services.length);
  }
}
