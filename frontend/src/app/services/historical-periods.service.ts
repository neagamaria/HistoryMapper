import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";


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

  public async getHistoricalPeriodById(id: string): Promise<void> {
  if (this.periodId != "") {
    let url1 = this.url + id;
    try {
      const response: any = await firstValueFrom(this.http.get<any>(url1));
      this.historicalPeriod = response.data;
    }
    catch (error) {
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
}
