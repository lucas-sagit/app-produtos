import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client';
import { GoBack } from '../go_Back/goBack';

@Component({
  selector: 'app-clients',
  imports: [CommonModule, GoBack],
  standalone: true,
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];

  constructor(private clientService: ClientService) {}

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
}
