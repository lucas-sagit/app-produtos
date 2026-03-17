import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../../services/payment.service';
import { Payment } from '../../../models/payment';
import { GoBack } from '../go_Back/goBack';

@Component({
  selector: 'app-payments',
  imports: [CommonModule, GoBack],
  standalone: true,
  templateUrl: './payments.html',
  styleUrl: './payments.css',
})
export class PaymentsComponent implements OnInit {
  payments: Payment[] = [];

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.paymentService.getPayments().subscribe({
      next: (data) => this.payments = data,
      error: (err) => {
        console.error('Erro ao buscar pagamentos:', err);
        this.payments = [];
      }
    });
  }
}
