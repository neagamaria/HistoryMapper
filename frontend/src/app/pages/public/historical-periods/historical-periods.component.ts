import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HistoricalPeriodsService} from "../../../services/historical-periods.service";

@Component({
  selector: 'app-historical-periods',
  templateUrl: './historical-periods.component.html',
  styleUrls: ['./historical-periods.component.css']
})
export class HistoricalPeriodsComponent {
  url: string = 'http://127.0.0.1:8000/api/historical-periods/';

  historicalPeriods: any[] = [];

  constructor(private periodsService: HistoricalPeriodsService, private http: HttpClient) {
    // obtain all periods with the service function that calls the API
      periodsService.getHistoricalPeriods();
      setTimeout(() =>
         this.historicalPeriods = periodsService.historicalPeriods, 200);
  }
}
