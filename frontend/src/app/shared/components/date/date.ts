import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { BaseChartDirective } from '../../directives/base-chart.directive';
import { MatDialog } from '@angular/material/dialog';
import { ProductsService } from '../../../services/products.service';
import { ServiceService } from '../../../services/service.service';
import { PaymentService } from '../../../services/payment.service';
import { ClientService } from '../../../services/client.service';
import { Subscription } from 'rxjs/internal/Subscription';


@Component({
  selector: 'app-date',
  standalone: true,
  templateUrl: './date.html',
  styleUrls: ['./date.css'],
  imports: [
    CommonModule,
    MatIcon,
    BaseChartDirective
  ]
})
export class DateComponent implements OnInit, OnDestroy {
  totalClients = 0;
  totalPayments = 0;
  totalServices = 0;
  totalProducts = 0;

  status = {
    total: 0,
    pending: 0,
    paid: 0,
    late: 0
  };

  dateFilter: any = null;
  allPayments: any[] = [];
  isFiltered = false;

  private subscriptions: Subscription[] = [];

  @Output() datesSelected = new EventEmitter<any>();

  isOpen = false;
  modo: 'multiple' | 'range' = 'range';

  currentDate = new Date();
  calendarDays: Date[] = [];

  selectedDates: Date[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;

  weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  pieChartData: any = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
      borderWidth: 0
    }]
  };
  pieChartOptions: any = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      }
    }
  };
  pieChartType: 'pie' | 'doughnut' = 'doughnut';
  chartLegend: { label: string; value: number; color: string }[] = [];

  constructor(
    private clientService: ClientService,
    private paymentService: PaymentService,
    private serviceService: ServiceService,
    private productsService: ProductsService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.generateCalendar();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleCalendar() {
    this.isOpen = !this.isOpen;
  }

  close() {
    this.isOpen = false;
  }

  get currentMonthName() {
    return this.currentDate.toLocaleString('pt-BR', { month: 'short' });
  }

  get currentYear() {
    return this.currentDate.getFullYear();
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const lastDay = new Date(year, month + 1, 0);

    const days: Date[] = [];

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    this.calendarDays = days;
  }

  prevMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateCalendar();
  }

  toggleDate(date: Date) {

    if (this.modo === 'multiple') {

      const index = this.selectedDates.findIndex(d =>
        d.toDateString() === date.toDateString()
      );

      if (index >= 0) {
        this.selectedDates.splice(index, 1);
      } else {
        this.selectedDates.push(date);
      }

    } else {

      if (!this.startDate || (this.startDate && this.endDate)) {
        this.startDate = date;
        this.endDate = null;
      } else {
        this.endDate = date;

        if (this.endDate < this.startDate) {
          [this.startDate, this.endDate] = [this.endDate, this.startDate];
        }
      }
    }

    this.emitSelection();
  }

  isSelected(date: Date): boolean {

    if (this.modo === 'multiple') {
      return this.selectedDates.some(d =>
        d.toDateString() === date.toDateString()
      );
    }

    if (this.modo === 'range' && this.startDate && this.endDate) {
      return date >= this.startDate && date <= this.endDate;
    }

    if (this.startDate) {
      return date.toDateString() === this.startDate.toDateString();
    }

    return false;
  }

  clearSelection() {
    this.selectedDates = [];
    this.startDate = null;
    this.endDate = null;

    this.emitSelection();
  }

  emitSelection() {
    if (this.modo === 'multiple') {
      this.datesSelected.emit(this.selectedDates);
    } else {
      this.datesSelected.emit({
        start: this.startDate,
        end: this.endDate
      });
    }
  }
}
