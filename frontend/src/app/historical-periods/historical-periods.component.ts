import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-historical-periods',
  templateUrl: './historical-periods.component.html',
  styleUrls: ['./historical-periods.component.css']
})
export class HistoricalPeriodsComponent {
  url: string = 'http://127.0.0.1:8000/api/historical_periods/';

  historicalPeriods: any[] = [];

  constructor(private http: HttpClient)
  {
      this.getHistoricalPeriods();
  }

  public getHistoricalPeriods() {
    this.http.get(this.url).subscribe((response: any): any => {
        this.historicalPeriods = response.data;
      }
    );
  }
}
