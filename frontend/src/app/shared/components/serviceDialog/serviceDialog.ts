import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client';

@Component({
  selector: 'app-service-dialog',
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
  templateUrl: './serviceDialog.html',
  styleUrl: './serviceDialog.css',
})
export class ServiceDialogComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  clients: Client[] = [];

  plansOptions = [
    { value: 'basico', label: 'Básico' },
    { value: 'padrao', label: 'Padrão' },
    { value: 'premium', label: 'Premium' },
    { value: 'enterprise', label: 'Enterprise' }
  ];

  statusOptions = [
    { value: 'ativo', label: 'Ativo' },
    { value: 'suspenso', label: 'Suspenso' },
    { value: 'cancelado', label: 'Cancelado' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ServiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clientService: ClientService
  ) {
    this.isEdit = !!data;

    this.form = this.fb.group({
      client_id: [data?.client_id || '', Validators.required],
      plans: [data?.plans || '', Validators.required],
      description: [data?.description || '', Validators.required],
      price: [data?.price || '', [Validators.required, Validators.min(0)]],
      started_at: [data?.started_at || '', Validators.required],
      status: [data?.status || 'ativo', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getClients().subscribe({
      next: (data: Client[]) => {
        this.clients = data;
      },
      error: (err: any) => {
        console.error('Erro ao carregar clientes:', err);
      }
    });
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  getVencimentoPreview(): string {

    const startedAt = this.form.get('started_at')?.value;
    if (!startedAt) return '';

    const [year, month, day] = startedAt.split('-').map(Number);

    // Date LOCAL, sem UTC
    const date = new Date(year, month - 1, day);

    date.setDate(date.getDate() + 30);

    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();

    return `${dd}/${mm}/${yyyy}`;

  }

  close() {
    this.dialogRef.close();
  }
}
