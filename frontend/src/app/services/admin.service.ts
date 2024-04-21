import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";

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
