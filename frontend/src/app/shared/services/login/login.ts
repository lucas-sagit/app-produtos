import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from '../../interface/login.interface';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:8000/api/login';

  constructor(private http: HttpClient) { }

  getLogin(): Observable<Login[]> {
    return this.http.get<Login[]>(this.apiUrl);
  }

  createLogin(login: Login): Observable<Login> {
    return this.http.post<Login>(this.apiUrl, login);
  }

}
