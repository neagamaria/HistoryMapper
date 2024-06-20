import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../../services/user.service";
import {QuizzesService} from "../../../services/quizzes.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-quizzes',
  templateUrl: './quizzes.component.html',
  styleUrls: ['./quizzes.component.css']
})
export class QuizzesComponent implements OnInit{
  currentUser: any = null;
  // categories for quizzes
  categories: any = [];
  // permanent list of categories
  categList: any = [];
  // last scores for each quiz
  quizzesHistory: any = [];
  // form for search option
  searchForm: FormGroup;
  // mark if the list of quizzes is opened
  listOpened = false;

  constructor(private router: Router, private fb: FormBuilder, private userService: UserService, private quizzesService: QuizzesService) {
    this.searchForm = this.fb.group ({
        name: ['', [Validators.required]]
      });
  }

  async ngOnInit() {
      this.currentUser = this.userService.getCurrentUsername();
      // page can not be accessed for no logged-in user
      if (this.currentUser == null) {
          this.router.navigate(['/login']).then();
      } else {
        await this.resetCategories();
        this.categList = this.categories;

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


  // search quiz category
  async getCategoryByName() {
    let categName = this.searchForm.get('name')?.value;
    await this.quizzesService.getCategoryByName(categName).then((response) => {
      if(response.status != 200) {
        alert("No category found");
        this.resetCategories();
      }
      else {
        // mark that only one category will be displayed
        this.categories = [];
        this.categories[0] = response.data;
      }
    });
  }

  // reset list of categories
  async resetCategories() {
    await this.quizzesService.getCategories().then((response) => {
          this.categories = response;
    });
  }

  goToQuizQuestions(id: string) {
    // set id for selected category
    this.quizzesService.setCategoryId(id);
    // navigate to questions
    this.router.navigate(['/quiz-questions']).then();
  }

}
