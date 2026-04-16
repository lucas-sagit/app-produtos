import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-date',
  standalone: true,
  templateUrl: './date.html',
  styleUrls: ['./date.css'],
  imports: [
    CommonModule,
    MatIcon
  ]
})
export class DateComponent implements OnInit {
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

  @Output() datesSelected = new EventEmitter<any>();

  isOpen = false;
  modo: 'multiple' | 'range' = 'range';

  currentDate = new Date();
  calendarDays: Date[] = [];

  selectedDates: Date[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;

  weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  ngOnInit(): void {
    this.generateCalendar();
  }

  toggleCalendar() {
    this.isOpen = !this.isOpen;
  }

  close() {
    this.isOpen = false;
  }

  onDatesCharge(filter: any){
    console.log('Filtro recebido', filter)

    this.dateFilter = filter;
    this.isFiltered = true;

    this.loadCurrentMonthData();

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

  if(this.dateFilter){

  }
}
