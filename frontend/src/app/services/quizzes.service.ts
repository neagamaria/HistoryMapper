import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class QuizzesService {
  // id for selected category
  private categoryId = '';
  constructor(private http: HttpClient) { }

  // function that gets all categories for quizzes
  public async getCategories() {
    let url = 'http://127.0.0.1:8000/api/categories';
    const response: any = await firstValueFrom(this.http.get<any>(url));

    if(response.status == 200) {
      return response.data;
    }

    else
      return [];
  }

  // function that calls the API for getting a quiz based on category id
  public async getQuiz() {
    try {
      if(this.categoryId != '') {
        let url = 'http://127.0.0.1:8000/api/quiz/' + this.categoryId;
        const response: any = await firstValueFrom(this.http.get<any>(url));
        console.log(response.data);

        if(response.status == 200)
          return response.data;
        else
          return [];
      }
      else return [];

    } catch(Exception) {
      alert("Couldn't load quiz");
      return [];
    }

  }
    // call API function that gets a specific quiz history
    public async getQuizHistory(username: any) {
      let url = "http://127.0.0.1:8000/api/quiz-history";
      const response: any =  await firstValueFrom(this.http.get<any>(url, username));
      console.log("Quiz history: ",response);
      return response.data;
    }

     // call API function that adds or edits quiz history
    public addQuizHistory(newData: any) {
      let url = "http://127.0.0.1:8000/api/quiz-history";
      return this.http.put<any>(url, newData);
    }



  public getCategoryId()  {
    return this.categoryId;
  }


  public setCategoryId(id: string) {
    this.categoryId = id;
  }
}
