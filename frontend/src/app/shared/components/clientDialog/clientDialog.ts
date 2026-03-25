import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './clientDialog.html',
  styleUrl: './clientDialog.css',

})
export class ClientDialogComponent {
  form: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ClientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEdit = !!data;

    this.form = this.fb.group({
      name: [data?.name || ''],
      corporate_name: [data?.corporate_name || ''],
      cnpj: [data?.cnpj || ''],
      cpf: [data?.cpf || ''],
      phone: [data?.phone || ''],
      city: [data?.city || ''],
      address: [data?.address || ''],
      street: [data?.street || ''],
      number: [data?.number || ''],
      status_client: [data?.status_client ?? true]
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
