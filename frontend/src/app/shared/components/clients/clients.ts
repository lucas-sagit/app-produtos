import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client';
import { GoBack } from '../go_Back/goBack';
import { MatIcon } from '@angular/material/icon';
import { ClientDialogComponent } from '../clientDialog/clientDialog';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-clients',
  imports: [CommonModule, GoBack, MatIcon, ClientDialogComponent, MatDialogModule ],
  standalone: true,
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];

  constructor(
    private clientService: ClientService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getClients().subscribe({
      next: (data) => this.clients = data,
      error: (err) => {
        console.error('Erro ao buscar clientes:', err);
        this.clients = [];
      }
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(ClientDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clientService.createClient(result).subscribe({
          next: () => this.loadClients(),
          error: (err) => console.error('Erro ao criar cliente:', err)
        });
      }
    })
  }
}
