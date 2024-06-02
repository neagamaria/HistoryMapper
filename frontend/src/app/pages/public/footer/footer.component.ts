import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  constructor(private router: Router) {}

  goToHome() {
    this.router.navigate(['']).then();
  }

  goToMap() {
    this.router.navigate(['/explore-maps']).then();
  }

  goToHistoricalPeriods() {
    this.router.navigate(['/historical-periods']).then();
  }

  goToQuizzes() {
    this.router.navigate(['/quizzes']).then();
  }

}
