import {Component, OnInit} from '@angular/core';
import {QuizzesService} from "../../../services/quizzes.service";
import {Router} from "@angular/router";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-quiz-questions',
  templateUrl: './quiz-questions.component.html',
  styleUrls: ['./quiz-questions.component.css']
})
export class QuizQuestionsComponent implements OnInit {
  questions: any = [];
  id = "";
  currentUser: any = null;
  // result of the quiz
  result = 0;
  // all selected answers for the current quiz
  selectedAnswers: { [key: number]: string } = {};
  //mark if quiz is finished
  isFinished = false;

  constructor(private userService: UserService, private quizzesService: QuizzesService, private router: Router) {
  }

  async ngOnInit() {
    this.currentUser = this.userService.getCurrentUsername();
    // page can not be accessed for not logged-in user
    if (this.currentUser == null) {
      this.router.navigate(['/login']).then();
    } else {
      // get questions
      await this.quizzesService.getQuiz().then((response) => {
        this.questions = response;
      });
    }
  }

  //calculate the total score of the current quiz
  calculateResult(form: any){
    let index = 0;
    for(let question of this.questions) {
      if(this.selectedAnswers[index++] == question.right_answer) {
        this.result++;
      }
    }
    // final score percentage
    this.result = Math.floor(100 * this.result / index);
    // mark that quiz is finished
    this.isFinished = true;
    // add result to quiz history
    let newData = {
      user: this.currentUser,
      category_id: this.quizzesService.getCategoryId(),
      last_score: this.result
    };

    // call the API that adds to quiz history
    this.quizzesService.addQuizHistory(newData).subscribe({
      next: (response) => {
        console.log("RESPONSE:", response);
      }
    });
  }

  goToQuizzes() {
    this.router.navigate(['/quizzes']).then();
  }
}
