import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class QuizzesService {
  url: string = 'http://127.0.0.1:8000/api/quizzes';
  quizzes: any = [];
  constructor(private http: HttpClient) { }

   public async getQuizzes(): Promise<void> {
        try {
            const response: any = await firstValueFrom(this.http.get<any>(this.url));
            this.quizzes = response.data;

        } catch (error) {
            console.error("Error fetching quizzes:", error);
        }
  }
}
