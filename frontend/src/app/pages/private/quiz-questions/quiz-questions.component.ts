import {Component, OnInit} from '@angular/core';
import {QuizzesService} from "../../../services/quizzes.service";
import {Router} from "@angular/router";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-quiz-questions',
  templateUrl: './quiz-questions.component.html',
  styleUrls: ['./quiz-questions.component.css']
})
export class QuizQuestionsComponent implements OnInit{
  questions: any = [];
  id = "";
  currentUser: any = null;
  // result of the quiz
  result = 0;
  // all selected answers for the current quiz
   selectedAnswers: number[] = [];
   //mark if quiz is finished
    isFinished = false;
  constructor(private userService: UserService, private quizzesService: QuizzesService, private router: Router){}

  async ngOnInit() {
    this.currentUser = this.userService.getCurrentUsername();
    // page can not be accessed for no logged-in user
    if (this.currentUser == null) {
      this.router.navigate(['/login']).then();
    }
    else {
      // get current quiz id
      this.id = this.quizzesService.getId();
      //get questions for current quiz
      if (this.id != null) {
        await this.quizzesService.getQuestions(this.id);
        this.questions = this.quizzesService.getQuestionsValue();

        console.log("QUESTIONS IN COMPONENT: ", this.questions);
      } else {
        this.router.navigate(['/quizzes']).then();
      }
    }
  }

  //calculate the total score of the current quiz
  calculateResult(form: any){
    console.log("ANSWERS: ", this.selectedAnswers);
    let index = 0;
    for(let question of this.questions) {
      if(this.selectedAnswers[index++] == question.correct_answer) {
        this.result++;
      }
    }

    this.result = 100 * this.result / index;
    this.isFinished = true;
  }

  goToQuizzes() {
    this.router.navigate(['/quizzes']).then();
  }


}
