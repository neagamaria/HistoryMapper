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
      let url = 'http://127.0.0.1:8000/api/quiz/categoryId';
      const response: any = await firstValueFrom(this.http.get<any>(url));

      if(response.status == 200)
        return response.data;
      else
        return [];

    } catch(Exception) {
      alert("Couldn't load quiz")
    }

  }


  public getCategoryId()  {
    return this.categoryId;
  }

  public setCategoryId(id: string) {
    this.categoryId = id;
  }


}
