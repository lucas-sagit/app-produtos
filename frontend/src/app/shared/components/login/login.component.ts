import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Login } from '../../interface/login.interface';
import { CommonModule } from '@angular/common';

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


  constructor(private http: HttpClient, private formBuilder: FormBuilder) { }

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
      console.log(this.loginForm.value);
    }
  }
}
