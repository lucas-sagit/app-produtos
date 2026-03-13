import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../../services/payment.service';
import { Payment } from '../../../models/payment';

@Component({
  selector: 'app-payments',
  imports: [CommonModule],
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
    this.paymentService.getPayments().subscribe(data => this.payments = data);
  }
}
