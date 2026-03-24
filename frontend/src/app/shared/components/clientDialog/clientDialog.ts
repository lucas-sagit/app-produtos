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
      name: [data?.name || '', Validators.required],
      corporate_name: [data?.corporate_name || '', Validators.required],
      cnpj: [data?.CNPJ || '', Validators.required],
      cpf: [data?.CPF || '', Validators.required],
      phone: [data?.phone || '', Validators.required],
      city: [data?.city || '', Validators.required],
      address: [data?.address || '', Validators.required],
      street: [data?.street || '', Validators.required],
      number: [data?.number || '', Validators.required],
      active: [data?.active ?? true]
    });
  }

  ngOnInit(){
    if(this.data) {
      this.form.patchValue(this.data);}
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
