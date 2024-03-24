import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormGroup, FormBuilder, Validators, FormArray, FormControl} from '@angular/forms';

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
    // all possible event types
    eventTypes: any[] = [];
    // form for search option
    searchForm: FormGroup;
    // form for filter option
    filterForm: FormGroup;

    constructor(private http: HttpClient, private fb: FormBuilder, private eventsService: EventsService) {
      this.searchForm = this.fb.group ({
        eventName: ['', [Validators.required]]
      });

      this.filterForm = this.fb.group({
        checkboxes: this.fb.group({})
      });
    }

    async ngOnInit() {
      this.selectedOption = "";
      this.menuOpened = false;
      // call APi for event types from service
      await this.eventsService.callTypesApi()
      // get event types
      this.eventTypes = this.eventsService.getEventTypes();

      console.log("TYPES", this.eventTypes)

      // add checkboxes
      this.addCheckBoxes()

    }

    openMenu() {
      this.menuOpened = true;
    }

    closeMenu() {
      this.menuOpened = false;
    }

    selectOption(option: string) {
      this.selectedOption = option;
      console.log(option)
    }

    getEventByName() {
      let eventName = this.searchForm.get('eventName')?.value;

      // close search area
      this.selectOption("")

      if(eventName) {
        this.eventsService.setSearchedName(eventName);
      }
      else {
        console.error("Error fetching event by name: name is null");
      }
    }

    addCheckBoxes() {
      const checkboxesGroup = this.filterForm.controls['checkboxes'] as FormGroup;

      for(let type of this.eventTypes) {
        checkboxesGroup.addControl(type.name, new FormControl(false));
      }
    }

    submitFilters() {
      const checkedTypes = [];
      const checkboxesFormGroup = this.filterForm.get('checkboxes') as FormGroup;
      const checkboxesVal = checkboxesFormGroup.value;

      for(let type in checkboxesVal) {
        // check if type is checked
        if(checkboxesVal[type]) {
          checkedTypes.push(type);
        }
      }

      this.eventsService.setSavedFilters(checkedTypes);
    }
}
