import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class EventsService {

  // events between time range
  private eventsBetweenYears: any[] = [];
  // searched name of event
  private searchedName = "";
  // searched event
  private searchedEvent: any = [];

  constructor(private http: HttpClient) { }

  // call the API that retrieves all events in a time range
  public async callEventsBetweenYearsApi(startYear: number, startEra: string, endYear: number, endEra: string) {
    let url = `http://127.0.0.1:8000/api/events-between-${startYear}-${startEra}-${endYear}-${endEra}`

    const response: any = await firstValueFrom(this.http.get<any>(url));
    this.eventsBetweenYears = response.data;
  }

  // call the API that gets event by name
  public async callEventByNameApi() {
    // clear all previous saved events
    this.clearEvents();

    let url = `http://127.0.0.1:8000/api/event-by-name-${this.searchedName}`

    const response: any = await firstValueFrom(this.http.get<any>(url));
    this.searchedEvent = response.data;
  }

  // remove all events from list
  public clearEvents() {
    this.eventsBetweenYears = [];
  }

  // get all events from list
  public getEventsBetweenYearsValue(): any {
    return this.eventsBetweenYears;
  }

  // remove searched event's value
  public clearSearchedEvent() {
    this.searchedEvent = [];
  }

 // get current value of searched event
  public getSearchedEvent(): any {
    return this.searchedEvent;
  }

  // get searched name value
  public getSearchedName(): string {
    return this.searchedName;
  }

  // set searched name value
  public setSearchedName(name: string) {
    this.searchedName = name;
  }
 
}
