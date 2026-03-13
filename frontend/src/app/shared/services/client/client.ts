import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Client {
  private Url = 'http://localhost:8000/api/clients';

  constructor(private http: HttpClient) {}

  createClient(client: any) {
    return this.http.post<any>(this.Url, client);
  }

  getClients() {
    return this.http.get<any[]>(this.Url);
  }

  updateClient(id: number, client: any) {
    return this.http.put<any>(`${this.Url}/${id}`, client);
  }

  deleteClient(id: number) {
    return this.http.delete<any>(`${this.Url}/${id}`);
  }
}
