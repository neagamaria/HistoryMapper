import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, firstValueFrom} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class EventsService {

  // events between time range
  private eventsBetweenYears: any[] = [];
  // event clicked for displaying info
  private clickedEvent: any = null;

  // searched name of event, make changes visible all the time
  private searchedName = new BehaviorSubject<string>("");
  // searched event
  private searchedEvent: any = [];
  // all types of events
  private eventTypes: any[] = [];
  // types for filter option
  private savedFilters= new BehaviorSubject<any[]>([]);
  // mark if routes mode is on or off
  private routesMode = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  // call the API that retrieves all events in a time range
  public async callEventsBetweenYearsApi(startYear: number, startEra: string, endYear: number, endEra: string) {
    this.clearEvents();
    let url = `http://127.0.0.1:8000/api/events-between-${startYear}-${startEra}-${endYear}-${endEra}`
    const response: any = await firstValueFrom(this.http.get<any>(url));

    if(response.status == 200)
      this.eventsBetweenYears = response.data;
    else
      this.eventsBetweenYears = [];
  }

  // call the API that gets event by name
  public async callEventByNameApi() {
    // clear all previous saved events
    this.clearEvents();
    let url = `http://127.0.0.1:8000/api/event-by-name-${this.searchedName.value}`
    const response: any = await firstValueFrom(this.http.get<any>(url));

    if(response.status == 200)
      this.searchedEvent = response.data;
    else
      this.searchedEvent = [];
  }

  // call the API that gets all event types
  public async callTypesApi(){
    let url = 'http://127.0.0.1:8000/api/all-types/'
    const response: any = await firstValueFrom(this.http.get<any>(url));
    this.eventTypes = response.data;
  }

  // call the API that obtains a route based on a starting event
  public async callRoutesAPI(categoryId: string, eventTypeId: string) {
    let url = 'http://127.0.0.1:8000/api/routes/' + categoryId + '/' + eventTypeId + '/';
    const response = await firstValueFrom(this.http.get<any>(url));

    return response.data;
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
  public getSearchedName() {
    return this.searchedName.asObservable();
  }

  // set searched name value
  public setSearchedName(name: string) {
    this.searchedName.next(name);
  }

  // get event types
  public getEventTypes() {
    return this.eventTypes;
  }

  // get saved filters
  public getSavedFilters() {
    return this.savedFilters.asObservable();
  }

  // set saved filters values
  public setSavedFilters(filters: any) {
    this.savedFilters.next(filters);
  }

  // save the event for which info will be displayed
  public setClickedEvent(event: any) {
    this.clickedEvent = event;
  }

  // get the event for which info is displayed
  public getClickedEvent() {
    if(this.clickedEvent)
      return this.clickedEvent;

    return null;
  }


  // switch on-off routes mode
  public setRoutesMode(status: boolean) {
    this.routesMode.next(status);
  }

  // get the routes mode status
  public getRoutesMode() {
    return this.routesMode.asObservable();
  }
}
