import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-go-back',
  imports: [],
  templateUrl: './goBack.html',
  styleUrl: './goBack.css',
})
export class GoBack {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
