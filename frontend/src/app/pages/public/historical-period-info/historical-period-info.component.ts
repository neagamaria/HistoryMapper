import {Component, OnInit} from '@angular/core';
import {HistoricalPeriodsService} from "../../../services/historical-periods.service";
import {Router} from "@angular/router";
import {EventsService} from "../../../services/events.service";

@Component({
  selector: 'app-historical-period-info',
  templateUrl: './historical-period-info.component.html',
  styleUrls: ['./historical-period-info.component.css']
})
export class HistoricalPeriodInfoComponent implements OnInit {
  historicalPeriod: any = [];
  id = "";

  constructor(private periodsService: HistoricalPeriodsService, private eventsService: EventsService, private router: Router) {
  }

  async ngOnInit() {
    // get current id
    this.id = this.periodsService.getId();
    // obtain a single period based on id with the service function that calls the API
    if (this.id != "") {
      await this.periodsService.getHistoricalPeriodById();
      this.historicalPeriod = this.periodsService.getHistoricalPeriod();
    } else {
      this.router.navigate(['/historical-periods']).then();
    }
  }


  // go to map to see historical period events
  async goToMap() {
    this.router.navigate(['/explore-maps']).then(async () => {
      let minVal = parseInt(this.historicalPeriod.start_year), maxVal = parseInt(this.historicalPeriod.end_year);
      // set timeline range for map events
      if (this.historicalPeriod.era === 'BC' || this.historicalPeriod.era == 'BC - AD')
        minVal = -minVal;

      if (this.historicalPeriod.era === 'BC')
        maxVal = -maxVal;

      // events will not be seen in routes mode
      this.eventsService.setRoutesMode(false);
      // timeline values are changed to current interval
      this.eventsService.setMinVal(minVal);
      this.eventsService.setMaxVal(maxVal);
    });
  }
}
