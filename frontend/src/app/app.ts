import { Component } from '@angular/core';
import { RouterOutlet, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { GoBack } from './shared/components/go_Back/goBack';
import { filter } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GoBack, MatPaginator],
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
