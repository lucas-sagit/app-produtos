import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Service {
  private Url = 'http://localhost:8000/api/services';

  constructor(private http: HttpClient) { }

  getServices() {
    return this.http.get<any[]>(this.Url);
  }
}
