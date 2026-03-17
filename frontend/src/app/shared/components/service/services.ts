import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceService } from '../../../services/service.service';
import { Service } from '../../../models/service';
import { GoBack } from '../go_Back/goBack';

@Component({
  selector: 'app-services',
  imports: [CommonModule, GoBack],
  standalone: true,
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];

  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.serviceService.getServices().subscribe(data => this.services = data);
  }
}
