import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ServiceService } from '../../../services/service.service';
import { Service } from '../../../models/service';

@Component({
  selector: 'app-payment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './paymentDialog.html',
  styleUrl: './paymentDialog.css',
})
export class PaymentDialogComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  services: Service[] = [];

  statusOptions = [
    { value: 'pending', label: 'Pendente' },
    { value: 'paid', label: 'Pago' },
    { value: 'late', label: 'Atrasado' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceService: ServiceService
  ) {
    this.isEdit = !!data;

    this.form = this.fb.group({
      service_id: [data?.service_id || '', Validators.required],
      amount: [data?.amount || '', [Validators.required, Validators.min(0)]],
      due_date: [data?.due_date || '', Validators.required],
      status: [data?.status || 'pending', Validators.required]
    });

    // Quando criar um novo pagamento e selecionar um serviço, preenche o valor automaticamente
    if (!this.isEdit) {
      this.form.get('service_id')?.valueChanges.subscribe((serviceId: number) => {
        if (serviceId) {
          const selectedService = this.services.find(s => s.id === serviceId);
          if (selectedService && selectedService.price) {
            this.form.patchValue({ amount: selectedService.price }, { emitEvent: false });
          }
          const selectExperation = this.services.find(s => s.id === serviceId);
          if (selectExperation && selectExperation.due_date) {
            this.form.patchValue({ due_date: selectExperation.due_date }, { emitEvent: false });
          }
        }
      });
    }
  }

  ngOnInit(): void {
    this.loadServices();
    this.loadServicedueDate();
  }

  loadServices(): void {
    this.serviceService.getServices().subscribe({
      next: (data: Service[]) => {
        this.services = data;
        // Se estiver editando e já tiver um service_id, preenche o valor do serviço
        if (this.isEdit && this.form.value.service_id) {
          const selectedService = this.services.find(s => s.id === this.form.value.service_id);
          if (selectedService && selectedService.price && !this.form.value.amount) {
            this.form.patchValue({ amount: selectedService.price }, { emitEvent: false });
          }
        }
      },
      error: (err: any) => {
        console.error('Erro ao carregar serviços:', err);
      }
    });
  }

  loadServicedueDate(): void {
    this.serviceService.getServices().subscribe({
      next: (data: Service[]) => {
        this.services = data;
        // Se estiver editando e já tiver um service_id, preenche o valor do serviço
        if (this.isEdit && this.form.value.service_id) {
          const selectExperation = this.services.find(s => s.id === this.form.value.service_id);
          if (selectExperation && selectExperation.due_date && !this.form.value.due_date) {
            this.form.patchValue({ due_date: selectExperation.due_date }, { emitEvent: false });
          }
        }
      },
      error: (err: any) => {
        console.error('Erro ao carregar serviços:', err);
      }
    });
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
