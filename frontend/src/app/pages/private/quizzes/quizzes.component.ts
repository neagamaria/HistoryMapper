import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../../services/user.service";
import {QuizzesService} from "../../../services/quizzes.service";

@Component({
  selector: 'app-quizzes',
  templateUrl: './quizzes.component.html',
  styleUrls: ['./quizzes.component.css']
})
export class QuizzesComponent implements OnInit{
  currentUser: any = null;
  quizzes: any = [];
  constructor(private router: Router, private userService: UserService, private quizzesService: QuizzesService) {}

  async ngOnInit() {
      this.currentUser = this.userService.getCurrentUsername();
      // page can not be accessed for no logged-in user
      if (this.currentUser == null) {
          this.router.navigate(['/login']).then();
      } else {
          // obtain all periods with the service function that calls the API
          this.quizzes = await this.quizzesService.getQuizzes();
      }
  }

  goToQuizQuestions(id: string) {
    this.quizzesService.setId(id);
    this.router.navigate(['/quiz-questions']).then();
  }
}
