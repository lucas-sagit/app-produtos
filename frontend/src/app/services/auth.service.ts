import { Injectable } from '@angular/core';

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

  getUser(): string {
    const token = localStorage.getItem('token');
    if (!token) {
      return 'Usuário';
    }

    try {
      const payloadBase64 = token.split('.')[1];
      if (!payloadBase64) {
        return 'Usuário';
      }

      const normalizedBase64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const paddedBase64 = normalizedBase64.padEnd(
        normalizedBase64.length + (4 - (normalizedBase64.length % 4)) % 4,
        '='
      );
      const payloadJson = atob(paddedBase64);
      const payload = JSON.parse(payloadJson);

      return payload?.name || payload?.username || 'Usuário';
    } catch {
      return 'Usuário';
    }
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    // Aqui você poderia validar se o token não está expirado
    return !!token;
  }

}

