import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-hello-menu',
  templateUrl: './hello-menu.component.html',
  styleUrls: ['./hello-menu.component.css']
})

export class HelloMenuComponent {
  constructor(private router: Router) {

}
  // indicates if the bottom image should be displayed
  displayBackgroundImg = false;

  clickOnArrow()
  {
    this.displayBackgroundImg = !this.displayBackgroundImg;
  }

  goToExploreMaps() {
    this.router.navigate(['/explore-maps']).then();
  }

  goToHistoricalPeriods() {
    this.router.navigate(['/historical-periods']).then();
  }

    goToQuizzes() {
    this.router.navigate(['/quizzes']).then();
  }

}
