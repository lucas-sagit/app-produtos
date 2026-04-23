import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-open-notification',
  standalone: true,
  imports: [MatDialogModule, MatIcon, MatButtonModule, CommonModule],
  templateUrl: './openNotification.html',
  styleUrl: './openNotification.css',
})
export class OpenNotificationComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any[]) { }

  getClientName(payment: any): string {
    return payment?.service?.client?.name || 'Cliente não informado';
  }

  getServicePlans(payment: any): string {
    return payment?.service?.plans || 'Serviço não informado';
  }

  getDueDate(payment: any): string {
    if (!payment?.due_date) return '';
    const [year, month, day] = payment.due_date.split('-');
    const date = new Date(payment.due_date);
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  }

  getDaysLate(payment: any): number {
    if (!payment?.due_date) return 0;
    const dueDate = new Date(payment.due_date);
    const today = new Date();
    const diffTime = today.getTime() - dueDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  getAmount(payment: any): string{
    if (!payment?.amount) return 'Valor não informado';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payment.amount);
  }
}
