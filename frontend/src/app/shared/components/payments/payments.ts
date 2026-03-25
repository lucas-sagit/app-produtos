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

  loadPayments() {
    this.paymentService.getPayments().subscribe({
      next:(data) => this.payments = data,
      error:(err) => console.error(err)
    });
  }

  pay(id: number){
    this.paymentService.pay(id).subscribe(()=>{
      this.loadPayments();
    });
  }

  getStatusLabel(status: string){
    switch(status){
      case 'pending': return 'Pendente';
      case 'paid': return 'Pago';
      case 'late': return 'Atrasado';
      default: return status;
    }
  }
}
