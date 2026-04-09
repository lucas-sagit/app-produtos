import { Injectable } from '@angular/core';
import { LoginComponent } from '../shared/components/login/login.component';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  // Simulação: em produção você guardaria o token JWT
  login(token: string) {
    localStorage.setItem('token', token);
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    // Aqui você poderia validar se o token não está expirado
    return !!token;
  }

}

