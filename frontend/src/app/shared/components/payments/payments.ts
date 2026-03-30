import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../../services/payment.service';
import { Payment } from '../../../models/payment';
import { GoBack } from '../go_Back/goBack';
import { MatIcon } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PaymentDialogComponent } from '../paymentDialog/paymentDialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/select';
import { interval } from 'rxjs';
import { OpenHistory } from '../openHistory/openHistory';

@Component({
  selector: 'app-payments',
  imports: [
    CommonModule,
    FormsModule,
    GoBack,
    MatIcon,
    MatSelect,
    MatOption,
    MatDialogModule,
    MatPaginator,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    OpenHistory
  ],
  standalone: true,
  templateUrl: './payments.html',
  styleUrl: './payments.css',
})
export class PaymentsComponent implements OnInit {
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  pagedPayments: Payment[] = [];
  searchService: string = '';
  filterStatus: string = 'all';
  pageSize = 10;
  currentPage = 0;

  status = {
    total: 0,
    pending: 0,
    paid: 0,
    late: 0
  };

  constructor(
    private paymentService: PaymentService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadPayments();

    // interval(5000).subscribe(() => {
    //   this.loadPayments();
    // });
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePagedPayments();
  }

  updatePagedPayments(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.pagedPayments = this.filteredPayments.slice(start, end);
  }

  loadPayments(): void {
    this.paymentService.getPayments().subscribe({
      next: (data: Payment[]) => {
        console.log('Pagamentos carregados:', data);
        this.payments = data;
        this.calculateStats();
        this.applyFilters();
        this.currentPage = 0;
        this.updatePagedPayments();
      },
      error: (err: any) => {
        console.error('Erro ao carregar pagamentos:', err);
        this.payments = [];
        this.filteredPayments = [];
      }
    });
  }

  calculateStats(): void {
    this.status.total = this.payments.length;
    this.status.pending = this.payments.filter(p => p.status === 'pending').length;
    this.status.paid = this.payments.filter(p => p.status === 'paid').length;
    this.status.late = this.payments.filter(p => p.status === 'late').length;
  }

  applyFilters(): void {
    let filtered = this.payments;

    // Filtro por status
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === this.filterStatus);
    }

    // Filtro por busca
    if (this.searchService.trim()) {
      filtered = filtered.filter(payment =>
        payment.service?.client?.name?.toLowerCase().includes(this.searchService.toLowerCase()) ||
        payment.service?.plans?.toLowerCase().includes(this.searchService.toLowerCase())
      );
    }

    this.filteredPayments = filtered;
    this.updatePagedPayments();
  }

  searchByService(): void {
    this.currentPage = 0;
    this.applyFilters();
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.applyFilters();
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(PaymentDialogComponent);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.paymentService.createPayment(result).subscribe({
          next: () => {
            this.loadPayments();
          },
          error: (err: any) => {
            console.error('Erro ao criar pagamento:', err);
          }
        });
      }
    });
  }

  openEditDialog(payment: Payment) {
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      data: payment
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.paymentService.updatePayment(payment.id, result).subscribe({
          next: () => {
            this.loadPayments();
          },
          error: (err: any) => {
            console.error('Erro ao atualizar pagamento:', err);
          }
        });
      }
    });
  }


  openHistory(serviceId: number) {
    console.log('openHistory chamado com serviceId:', serviceId);
    console.log('payment completo:', this.pagedPayments.find(p => p.service?.id === serviceId));

    if (!serviceId) {
      console.error('serviceId é inválido!');
      return;
    }

    this.paymentService.getHistory(serviceId).subscribe({
      next: (res) => {
        console.log('Histórico retornado:', res);
        this.dialog.open(OpenHistory, {
          width: '600px',
          data: res
        });
      },
      error: (err) => {
        console.error('Erro ao buscar histórico:', err);
      }
    });
  }


  pay(id: number) {
    this.paymentService.pay(id).subscribe({
      next: () => {
        this.loadPayments();
      },
      error: (err: any) => {
        console.error('Erro ao confirmar pagamento:', err);
      }
    });
  }

  markLate() {
    this.paymentService.markLate().subscribe({
      next: () => {
        this.loadPayments();
      },
      error: (err: any) => {
        console.error('Erro ao marcar atrasados:', err);
      }
    });
  }

  deletePayment(payment: Payment) {
    if (confirm(`Tem certeza que deseja excluir este pagamento?`)) {
      this.paymentService.deletePayment(payment.id).subscribe({
        next: () => {
          this.loadPayments();
        },
        error: (err: any) => {
          console.error('Erro ao excluir pagamento:', err);
        }
      });
    }
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'Pendente',
      'paid': 'Pago',
      'late': 'Atrasado'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }
}
