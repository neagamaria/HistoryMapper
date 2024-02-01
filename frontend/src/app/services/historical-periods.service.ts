import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HistoricalPeriodsService {

   url: string = 'http://127.0.0.1:8000/api/historical-periods/';

   historicalPeriods: any[] = [];

   historicalPeriod: any = [];

   periodId: string = "";

  constructor(private http: HttpClient) {}

  public getHistoricalPeriods() {
    this.http.get(this.url).subscribe((response: any): any => {
        this.historicalPeriods = response.data;
      }
    );
  }

  public getHistoricalPeriodById(id: string) {

    if(this.periodId != "") {
      // change url to get only one period
      let url1 = this.url + id;

      this.http.get(url1).subscribe((response: any): any => {
        this.historicalPeriod = response.data;
      }
    );
    }
  }

  public getId() {
    return this.periodId;
  }

  public setId(id: string) {
    this.periodId = id;
  }
}
