import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class QuizzesService {
  private url: string = 'http://127.0.0.1:8000/api/quizzes';
  private url1 = 'http://127.0.0.1:8000/api/questions/';
  private quizzes: any = [];
  private questions: any = [];
  private quizId = "";
  constructor(private http: HttpClient) { }

  // call API that gets all quizzes from the DB
   public async getQuizzes(): Promise<void> {
        try {
            const response: any = await firstValueFrom(this.http.get<any>(this.url));
            this.quizzes = response.data;
            return this.quizzes;

        } catch (error) {
            console.error("Error fetching quizzes:", error);
        }
  }

  // call API that gets all questions from a quiz in the DB
  public async getQuestions(id:string): Promise<void> {
     try {
            this.url1 = this.url1 + id;
            const response: any = await firstValueFrom(this.http.get<any>(this.url1));
            this.questions = response.data;

        } catch (error) {
            console.error("Error fetching questions for quiz:", error);
        }
  }

   public getId() {
    return this.quizId;
  }

  public setId(id: string) {
    this.quizId = id;
  }

  getQuestionsValue(){
    return this.questions;
  }
}
