import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {HistoricalPeriodsService} from "../../../services/historical-periods.service";

import {Router} from "@angular/router";
import {UserService} from "../../../services/user.service";
import {AdminService} from "../../../services/admin.service";
import {EventsService} from "../../../services/events.service";

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit{

  url: string = 'http://127.0.0.1:8000/api/dpedia/';
  // forms for each CRUD operation
  addForm: FormGroup;
  showForm: FormGroup;
  editForm: FormGroup;
  deleteForm: FormGroup;

  // current logged-in user
  currentUser: any = null;
  //current action selected
  selectedAction: string = '';
  // added events
  events: any[] = [];
  // searched event
  searchedEvent: any = [];

  constructor (private router: Router, private fb: FormBuilder, private userService: UserService, private adminService: AdminService, private eventsService: EventsService) {
    // initialize form
    this.addForm = this.fb.group ({
      dbpediaCategory: ['', [Validators.required]],
      eventsType: ['', [Validators.required]],
      eventsCategory: ['', [Validators.required]],
    })

    this.showForm = this.fb.group ( {
      name: ['', [Validators.required]]
    })

    this.editForm = this.fb.group ( {
      newName: ['', [Validators.required]],
      newLocation: [''],
      newCategory: [''],
      newEventType: [''],
      newDescription: ['']
    })

    this.deleteForm = this.fb.group ( {
      name: ['', [Validators.required]]
    })

  }

  async ngOnInit() {
      this.currentUser = this.userService.getCurrentUsername();
      // page can be accessed only by admin
      console.log(this.currentUser);
      if(this.currentUser != "admin") {
          this.router.navigate(['/']).then();
      }
      else {
          // there are no new events in the first place
          this.events = [];
          this.searchedEvent = [];
      }
  }

  // set the current action selected
  selectAction(action: string) {
    this.selectedAction = action;

    console.log(this.searchedEvent)
  }


  async populateDB(form: any) {
      // set parameters for the API call
      this.adminService.setWikiCategory(this.addForm.get('dbpediaCategory')?.value);
      this.adminService.setEventsType(this.addForm.get('eventsType')?.value);
      this.adminService.setEventsCategory(this.addForm.get('eventsCategory')?.value);

      await this.adminService.addDbpediaData();
      this.events = this.adminService.getAddedEvents();

      console.log(this.events);
  }

  // get events by name
  async getEvent(form: any) {
    // search the event with the introduced name
    let name = this.showForm.get('name')?.value
    console.log(name)

    if(name) {
      this.eventsService.setSearchedName(name);

      await this.eventsService.callEventByNameApi();
      this.searchedEvent = this.eventsService.getSearchedEvent();

      console.log(this.searchedEvent)
    }
  }


  // edit a given event
  async editEvent(form: any) {
    // get the name of the event to be edited
    let name = this.searchedEvent;
    // get new values from form, if they exist or keep the old values
    let newName = this.editForm.get('newName')?.value ?? this.searchedEvent.name;
    let newLocation = this.editForm.get('newLocation')?.value ?? this.searchedEvent.location;
    let newCategory = this.editForm.get('newCategory')?.value ?? this.searchedEvent.category;
    let newEventType = this.editForm.get('newEventType')?.value ?? this.searchedEvent.event_type;
    let newDescription = this.editForm.get('newDescription')?.value ?? this.searchedEvent.description;

    // call the API that edits the event

  }
}
