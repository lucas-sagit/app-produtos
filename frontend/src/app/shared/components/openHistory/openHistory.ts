import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-open-history',
  imports: [CommonModule],
  templateUrl: './openHistory.html',
  styleUrl: './openHistory.css',
})
export class OpenHistory {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

 getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'paid': return 'Pago';
      case 'late': return 'Atrasado';
      default: return status;
    }
  }
}
