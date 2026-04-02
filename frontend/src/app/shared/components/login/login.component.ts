import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Login } from '../../interface/login.interface';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  private apiUrl = '/api/login';
  isLoading = false;

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      cpf: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  createLogin(login: Login): Observable<Login> {
    return this.http.post<Login>(this.apiUrl, login);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const loginData = this.loginForm.value;
    console.log(loginData);

    this.createLogin(loginData).subscribe({
      next: (response) => {
        console.log('Login feito com sucesso:', response);
        this.isLoading = false;

        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        this.router.navigate(['/dashboard']);
      },

      error: (err) => {
        console.error('Erro ao fazer login:', err);
        this.isLoading = false;
        alert('Login falhou. Verifique CPF e senha.');
      }
    });
  }
}
