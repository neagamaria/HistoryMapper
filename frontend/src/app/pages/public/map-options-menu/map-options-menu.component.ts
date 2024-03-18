import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { EventsService } from 'src/app/services/events.service';


@Component({
  selector: 'app-map-options-menu',
  templateUrl: './map-options-menu.component.html',
  styleUrls: ['./map-options-menu.component.css']
})
export class MapOptionsMenuComponent implements OnInit{

    // mark if menu is opened
    menuOpened:boolean = false;
    // mark selected option
    selectedOption:string = "";
    // form for search
    searchForm: FormGroup;


    constructor(private http: HttpClient, private fb: FormBuilder, private eventsService: EventsService) {
      this.searchForm = this.fb.group ({
        eventName: ['', [Validators.required]]
      })
    }

    ngOnInit() {
      this.selectedOption = "";
      this.menuOpened = false;
    }

    openMenu() {
      this.menuOpened = true;
    }

    closeMenu() {
      this.menuOpened = false;
    }

    selectOption(option: string) {
      this.selectedOption = option;
    }

    getEventByName() {
      let eventName = this.searchForm.get('eventName')?.value;

      if(eventName) {
        this.eventsService.setSearchedName(eventName);
      }
      else {
        console.error("Error fetching event by name: name is null");
      }

    }
}
