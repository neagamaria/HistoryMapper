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
  // categories for quizzes
  categories: any = [];

  constructor(private router: Router, private userService: UserService, private quizzesService: QuizzesService) {}

  async ngOnInit() {
      this.currentUser = this.userService.getCurrentUsername();
      // page can not be accessed for no logged-in user
      if (this.currentUser == null) {
          this.router.navigate(['/login']).then();
      } else {
        // get all categories in the db
          await this.quizzesService.getCategories().then((response) => {
            this.categories = response;
          });

          console.log("CATEGORIES: ", this.categories)
      }
  }

  goToQuizQuestions(id: string) {
    // set id for selected category
    this.quizzesService.setCategoryId(id);
    // navigate to questions
    this.router.navigate(['/quiz-questions']).then();
  }
}
