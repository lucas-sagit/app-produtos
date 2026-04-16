import { Component } from '@angular/core';
import { RouterOutlet, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  showGoBack: boolean = true;

 constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        let currentRoute = this.route;

        while (currentRoute.firstChild) {
          currentRoute = currentRoute.firstChild;
        }

        this.showGoBack = !currentRoute.snapshot.data['hideGoBack'];
      });
  }
}
