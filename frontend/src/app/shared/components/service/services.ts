import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceService } from '../../../services/service.service';
import { Service } from '../../../models/service';
import { GoBack } from '../go_Back/goBack';
import { MatIcon } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ServiceDialogComponent } from '../serviceDialog/serviceDialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-services',
  imports: [
    CommonModule,
    FormsModule,
    GoBack,
    MatIcon,
    MatDialogModule,
    ServiceDialogComponent,
    MatPaginator,
    MatFormFieldModule,
    MatInputModule
  ],
  standalone: true,
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];
  filteredServices: Service[] = [];
  pagedServices: Service[] = [];
  searchClient: string = '';
  pageSize = 10;
  currentPage = 0;

  constructor(
    private serviceService: ServiceService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePagedServices();
  }

  updatePagedServices(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.pagedServices = this.filteredServices.slice(start, end);
  }

  loadServices(): void {
    this.serviceService.getServices().subscribe({
      next: (data: Service[]) => {
        this.services = data;
        this.filteredServices = data;
        this.currentPage = 0;
        this.updatePagedServices();
      },
      error: (err: any) => {
        console.error('Erro ao carregar serviços:', err);
        this.services = [];
        this.filteredServices = [];
      }
    });
  }

  searchByClient(): void {
    if (this.searchClient.trim()) {
      this.filteredServices = this.services.filter(service =>
        service.client?.name?.toLowerCase().includes(this.searchClient.toLowerCase())
      );
    } else {
      this.filteredServices = this.services;
    }
    this.currentPage = 0;
    this.updatePagedServices();
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(ServiceDialogComponent);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.serviceService.createService(result).subscribe({
          next: () => {
            this.loadServices();
          },
          error: (err: any) => {
            console.error('Erro ao criar serviço:', err);
          }
        });
      }
    });
  }

  openEditDialog(service: Service) {
    const dialogRef = this.dialog.open(ServiceDialogComponent, {
      data: service
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.serviceService.updateService(service.id, result).subscribe({
          next: () => {
            this.loadServices();
          },
          error: (err: any) => {
            console.error('Erro ao atualizar serviço:', err);
          }
        });
      }
    });
  }

  deleteService(service: Service) {
    if (confirm(`Tem certeza que deseja excluir o serviço de ${service.client?.name}?`)) {
      this.serviceService.deleteService(service.id).subscribe({
        next: () => {
          this.loadServices();
        },
        error: (err: any) => {
          console.error('Erro ao excluir serviço:', err);
        }
      });
    }
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'ativo': 'Ativo',
      'suspenso': 'Suspenso',
      'cancelado': 'Cancelado'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'ativo': 'status-ativo',
      'suspenso': 'status-suspenso',
      'cancelado': 'status-cancelado'
    };
    return classes[status] || '';
  }
}
