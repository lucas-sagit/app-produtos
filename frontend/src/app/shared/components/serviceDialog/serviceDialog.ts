import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ClientService } from '../../../services/client.service';
import { ProductsService } from '../../../services/products.service';
import { Client } from '../../../models/client';
import { Product } from '../../../shared/interface/product.interface';

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
  products: Product[] = [];

  plansOptions = [
    { value: 'basico', label: 'Basico' },
    { value: 'padrao', label: 'Padrao' },
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
    private clientService: ClientService,
    private productsService: ProductsService
  ) {
    this.isEdit = !!data;

    this.form = this.fb.group({
      client_id: [data?.client_id || '', Validators.required],
      plans: [data?.plans || '', Validators.required],
      description: [data?.description || '', Validators.required],
      equipment_description: [data?.equipment_description || ''],
      equipment_lote: [data?.equipment_lote || ''],
      equipment_quantity: [data?.equipment_quantity ?? null],
      price: [data?.price || '', [Validators.required, Validators.min(0)]],
      started_at: [data?.started_at || '', Validators.required],
      status: [data?.status || 'ativo', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadClients();
    this.loadProducts();
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

  loadProducts(): void {
    this.productsService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
      },
      error: (err: any) => {
        console.error('Erro ao carregar produtos:', err);
      }
    });
  }

  get equipmentDescriptionOptions(): string[] {
    return [...new Set(this.products.map((product) => product.description).filter(Boolean))];
  }

  get equipmentLoteOptions(): Product[] {
    const description = this.form.get('equipment_description')?.value;
    if (!description) {
      return [];
    }

    return this.products.filter((product) => product.description === description);
  }

  get selectedEquipmentProduct(): Product | undefined {
    const description = this.form.get('equipment_description')?.value;
    const lote = this.form.get('equipment_lote')?.value;

    if (!description || !lote) {
      return undefined;
    }

    return this.products.find(
      (product) => product.description === description && product.lote === lote
    );
  }

  get equipmentQuantityOptions(): number[] {
    const product = this.selectedEquipmentProduct;
    if (!product) {
      return [];
    }

    const quantity = Number(product.quantity) || 0;
    return Array.from({ length: quantity }, (_, index) => index + 1);
  }

  onEquipmentDescriptionChange(): void {
    this.form.patchValue({
      equipment_lote: '',
      equipment_quantity: null
    });
  }

  onEquipmentLoteChange(): void {
    this.form.patchValue({
      equipment_quantity: null
    });
  }

  save(): void {
    if (this.form.valid) {
      const value = this.form.getRawValue();

      this.dialogRef.close({
        ...value,
        equipment_description: this.normalizeOptionalText(value.equipment_description),
        equipment_lote: this.normalizeOptionalText(value.equipment_lote),
        equipment_quantity: this.normalizeOptionalNumber(value.equipment_quantity),
      });
    }
  }

  getVencimentoPreview(): string {
    const startedAt = this.form.get('started_at')?.value;
    if (!startedAt) return '';

    const [year, month, day] = startedAt.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + 30);

    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();

    return `${dd}/${mm}/${yyyy}`;
  }

  close(): void {
    this.dialogRef.close();
  }

  private normalizeOptionalText(value: string | null | undefined): string | null {
    const normalized = (value ?? '').trim();
    return normalized ? normalized : null;
  }

  private normalizeOptionalNumber(value: number | string | null | undefined): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const normalized = Number(value);
    return Number.isFinite(normalized) ? normalized : null;
  }
}
