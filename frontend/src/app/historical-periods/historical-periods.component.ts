import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
@Component({
  selector: 'app-historical-periods',
  templateUrl: './historical-periods.component.html',
  styleUrls: ['./historical-periods.component.css']
})
export class HistoricalPeriodsComponent/* implements OnInit*/ {
  url: string = 'http://127.0.0.1:8000/api/historical-periods/';

  historicalPeriods: any[] = [];

  constructor(private http: HttpClient) {
  }

  // when the component is initialized, call the getHistoricalPeriods function
   ngOnInit(): void {
    this.getHistoricalPeriods();
  }
  public getHistoricalPeriods() {
    this.http.get(this.url).subscribe((response: any) => {
        this.historicalPeriods = response.data;
    });
}
}
