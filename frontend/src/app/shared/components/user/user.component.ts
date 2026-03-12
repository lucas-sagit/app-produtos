import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../../interface/user.interface'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user.component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit {

  userForm!: FormGroup;
  private apiUrl = 'http://localhost:8000/api/users';


  constructor(private http: HttpClient, private formBuilder: FormBuilder) { }

  getUser(): Observable<User> {
    return this.http.get<User>(this.apiUrl);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      cpf: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
    }
  }
}
