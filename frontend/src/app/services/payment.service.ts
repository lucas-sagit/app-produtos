import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = '/api/payments';

  constructor(private http: HttpClient) { }

  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl);
  }

  // getPayment(id: number): Observable<Payment> {
  //   return this.http.get<Payment>(`${this.apiUrl}/${id}`);
  // }

  createPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, payment);
  }

  updatePayment(id: number, payment: Partial<Payment>): Observable<Payment> {
    return this.http.put<Payment>(`${this.apiUrl}/${id}`, payment);
  }

  pay(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/pay`, {});
  }

  markLate(): Observable<any> {
    return this.http.post(`${this.apiUrl}/mark-late`, {});
  }

  deletePayment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getHistory(serviceId: number): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/history/${serviceId}`);
  }

  getNotifications(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/notification`);
  }

  getDashboardPayments() {
    return this.http.get<Payment[]>(`${this.apiUrl}/dashboard`);
  }
}
