import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Payment {
  private Url = 'http://localhost:8000/api/payments';

  constructor(private http: HttpClient) {}

  createPayment(payment: any): Observable<any> {
    return this.http.post<any>(this.Url, payment);
  }

  getPayments(): Observable<any[]> {
    return this.http.get<any[]>(this.Url);
  }
}
