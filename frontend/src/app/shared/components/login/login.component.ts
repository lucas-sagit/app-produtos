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
  private apiUrl = 'http://localhost:8000/api/login';


  constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router) { }

  getLogin(): Observable<Login> {
    return this.http.get<Login>(this.apiUrl);
  }

  createLogin(login: Login): Observable<Login> {
    return this.http.post<Login>(this.apiUrl, login);
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      cpf: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;

      this.createLogin(loginData).subscribe(response => {
        console.log('Login feito com sucesso:', response);

        localStorage.setItem('token', response.token || '');

        this.router.navigate(['/dashboard'])}, error => {
          console.error('Erro ao fazer login:', error);
          error('Login falhou. Por favor, verifique suas credenciais e tente novamente.');
        }
      );

    }
  }
}
