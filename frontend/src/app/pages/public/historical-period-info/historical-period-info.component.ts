import { Component } from '@angular/core';
import {HistoricalPeriodsService} from "../../../services/historical-periods.service";

@Component({
  selector: 'app-historical-period-info',
  templateUrl: './historical-period-info.component.html',
  styleUrls: ['./historical-period-info.component.css']
})
export class HistoricalPeriodInfoComponent {
  historicalPeriod: any = [];
  constructor(private periodsService: HistoricalPeriodsService) {
    // get current id
    let id = periodsService.getId();
    // obtain a single period based on id with the service function that calls the API

      periodsService.getHistoricalPeriodById(id);
      setTimeout(() =>
         this.historicalPeriod = periodsService.historicalPeriod, 200);
  }

}
