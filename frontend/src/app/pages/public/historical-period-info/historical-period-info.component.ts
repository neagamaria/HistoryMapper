import {Component, OnInit} from '@angular/core';
import {HistoricalPeriodsService} from "../../../services/historical-periods.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-historical-period-info',
  templateUrl: './historical-period-info.component.html',
  styleUrls: ['./historical-period-info.component.css']
})
export class HistoricalPeriodInfoComponent implements OnInit {
  historicalPeriod: any = [];
  id = "";
  constructor(private periodsService: HistoricalPeriodsService, private router: Router) {}

  async ngOnInit() {
    // get current id
    this.id = this.periodsService.getId();
    // obtain a single period based on id with the service function that calls the API
    if (this.id != null) {
      await this.periodsService.getHistoricalPeriodById(this.id);
      this.historicalPeriod = this.periodsService.getHistoricalPeriod();
    }
    else {
      this.router.navigate(['/historical-periods']).then();
    }
  }
}
