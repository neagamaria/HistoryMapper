import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";

import {EventsService} from './events.service';
import {Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})

export class HistoricalPeriodsService {

  private url: string = 'http://127.0.0.1:8000/api/historical-periods/';
  // all historical periods
  private historicalPeriods: any[] = [];
  // selected historical period
  private historicalPeriod: any = [];
  // id of the selected historical period
  private periodId: string = "";

  constructor(private http: HttpClient) {
  }

  // call API that retrieves all historical periods
  public async getHistoricalPeriods() {
    const response = await firstValueFrom(this.http.get<any>(this.url));
    this.historicalPeriods = response.data;
  }

  // call API that retrieves one historical period based on id
  public async getHistoricalPeriodById(): Promise<void> {
    console.log("PERIOD ID: ", this.periodId);
    if (this.periodId != "") {
      let url1 = this.url + this.periodId;
      try {
        const response: any = await firstValueFrom(this.http.get<any>(url1));
        this.historicalPeriod = response.data;
      } catch (error) {
        console.error("Error fetching historical period:", error);
      }
    }
  }

  public getId() {
    return this.periodId;
  }

  public setId(id: string) {
    this.periodId = id;
  }

  public getHistoricalPeriod() {
    return this.historicalPeriod[0];
  }

  public getHistoricalPeriodsValue(): any {
    return this.historicalPeriods;
  }
}
