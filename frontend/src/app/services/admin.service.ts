import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class AdminService {
    // category in dbpedia
    private wikiCategory: string = "";
    // type of events to be added
    private eventsType: string = "";
    // category in local database
    private eventsCategory: string = "";
    // number of events added to DB
    private addedEvents: any[] = [];
    // url for API
    private url: string = "";

    constructor(private http: HttpClient) { }

    // call API that adds dbpedia data to local database
    public async addDbpediaData(): Promise<void> {
    if(this.wikiCategory != "" && this.eventsType != null && this.eventsCategory != null) {
        let url: string = 'http://127.0.0.1:8000/api/dbpedia/' + this.wikiCategory + "/" + this.eventsType + "/" + this.eventsCategory;
        console.log(url);

        try {
         const response: any = await firstValueFrom(this.http.get<any>(url));
         this.addedEvents = response.data;
         console.log(this.addedEvents);
        }
        catch(error) {
          console.error("Error adding data to database", error);
        }
    }

     else {
        console.log("One or more parameters are null", this.wikiCategory, this.eventsType, this.eventsCategory);
     }
    }

    // call API that edits an event
    public editEvent(name: string, newData: any) {
      let url = "http://127.0.0.1:8000/api/event-by-name-" + name;
      return this.http.put<any>(url, newData);
    }


    // call API that deletes an event
    public deleteEvent(name: string) {
        let url = "http://127.0.0.1:8000/api/event-by-name-" + name;
        this.http.delete<any>(url);
    }


    public setWikiCategory(categ: string) {
        this.wikiCategory = categ;
    }

    public setEventsType(type: string) {
        this.eventsType = type;
    }

    public setEventsCategory(categ: string) {
        this.eventsCategory = categ;
    }

    public getAddedEvents() {
        return this.addedEvents;
    }
}
