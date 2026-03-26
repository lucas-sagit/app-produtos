import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client';
import { GoBack } from '../go_Back/goBack';
import { MatIcon } from '@angular/material/icon';
import { ClientDialogComponent } from '../clientDialog/clientDialog';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-clients',
  imports:
    [
      CommonModule,
      FormsModule,
      GoBack,
      MatIcon,
      ClientDialogComponent,
      MatDialogModule,
      MatPaginator
    ],
  standalone: true,
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  pagedClients: any[] = [];
  searchName: string = '';
  pageSize = 10;
  currentPage = 0;
  first = 0;

  constructor(
    private clientService: ClientService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadClients();
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePagedClients();
  }

  updatePagedClients(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.pagedClients = this.filteredClients.slice(start, end);

  }

  loadClients(): void {
    this.clientService.getClients().subscribe({
      next: (data: Client[]) => {
        console.log('Clientes recebidos:', data);
        this.clients = data;
        this.filteredClients = data;
        console.log('Clientes carregados:', this.clients.length);
        this.currentPage= 0;
        this.updatePagedClients();
      },
      error: (err: any) => {
        console.error('Erro ao buscar clientes:', err);
        this.clients = [];
        this.filteredClients = [];
      }
    });
  }

  searchByName(): void {
    if (this.searchName.trim()) {
      this.filteredClients = this.clients.filter(client =>
        client.name.toLowerCase().includes(this.searchName.toLowerCase())
      );
    } else {
      this.filteredClients = this.clients;
    }
    this.currentPage = 0;
    this.updatePagedClients();
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(ClientDialogComponent);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.clientService.createClient(result).subscribe({
          next: () => this.loadClients(),
          error: (err: any) => console.error('Erro ao criar cliente:', err)
        });
      }
    });
  }

  openEditDialog(client: Client) {
    const dialogRef = this.dialog.open(ClientDialogComponent, {
      data: client
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('Resultado do dialog:', result);
      if (result) {
        console.log('Atualizando cliente:', client.id, 'com dados:', result);
        this.clientService.updateClient(client.id, result).subscribe({
          next: (response) => {
            console.log('Cliente atualizado com sucesso:', response);
            this.loadClients();
          },
          error: (err: any) => {
            console.error('Erro ao atualizar cliente:', err);
          }
        });
      }
    });
  }
}
