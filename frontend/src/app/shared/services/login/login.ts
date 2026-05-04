import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from '../../interface/login.interface';
import { User } from '../../interface/user.interface';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:8000/api/login';

  constructor(private http: HttpClient) { }
  login(credentials: Login): Observable<{ user: User; token: string }> {
    return this.http.post<{ user: User; token: string }>(this.apiUrl, credentials);
  }

  getUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user`);
  }
}
