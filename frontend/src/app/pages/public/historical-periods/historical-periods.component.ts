import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HistoricalPeriodsService} from "../../../services/historical-periods.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-historical-periods',
  templateUrl: './historical-periods.component.html',
  styleUrls: ['./historical-periods.component.css']
})
export class HistoricalPeriodsComponent implements OnInit{
  url: string = 'http://127.0.0.1:8000/api/historical-periods/';

  historicalPeriods: any[] = [];

  constructor(private periodsService: HistoricalPeriodsService, private http: HttpClient, private router: Router) {
  }

  ngOnInit() {
    // obtain all periods with the service function that calls the API
      this.periodsService.getHistoricalPeriods();
      setTimeout(() =>
         this.historicalPeriods = this.periodsService.historicalPeriods, 200);
  }

  goToHistoricalPeriodInfo(id: string) {
    this.periodsService.setId(id);
    setTimeout(() => console.log("Id set in historical-periods", this.periodsService.getId()));
    this.router.navigate(['/historical-period-info']).then();
  }

}
