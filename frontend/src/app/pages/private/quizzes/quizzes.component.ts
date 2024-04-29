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
  // last scores for each quiz
  quizzesHistory: any = [];

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


          // get the last score for each quiz category
          await this.quizzesService.getQuizHistory(this.currentUser).then((response) => {
           // this.quizzesHistory = response;

            this.categories.forEach((category: any) => {
              if(response[0][category.id])
                this.quizzesHistory[category.id] = response[0][category.id].last_score;
              else
                this.quizzesHistory[category.id] = null;
            })
            console.log(this.quizzesHistory);
          });
      }
  }


  goToQuizQuestions(id: string) {
    // set id for selected category
    this.quizzesService.setCategoryId(id);
    console.log("CategoryId in QuizzesComponent: ", this.quizzesService.getCategoryId());
    // navigate to questions
    this.router.navigate(['/quiz-questions']).then();
  }
}
