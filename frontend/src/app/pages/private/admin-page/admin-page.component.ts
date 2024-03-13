import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {HistoricalPeriodsService} from "../../../services/historical-periods.service";

import {Router} from "@angular/router";
import {UserService} from "../../../services/user.service";
import {AdminService} from "../../../services/admin.service";

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit{

  url: string = 'http://127.0.0.1:8000/api/dpedia/';
  form: FormGroup;
  // current logged-in user
  currentUser: any = null;
  // added events
  events: any[] = [];

  constructor (private router: Router, private fb: FormBuilder, private userService: UserService, private adminService: AdminService) {
      // initialize form
      this.form = this.fb.group ({
        dbpediaCategory: ['', [Validators.required]],
        eventsType: ['', [Validators.required]],
        eventsCategory: ['', [Validators.required]],
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
      }
  }

  async populateDB(form: any) {
      // set parameters for the API call
      this.adminService.setWikiCategory(this.form.get('dbpediaCategory')?.value);
      this.adminService.setEventsType(this.form.get('eventsType')?.value);
      this.adminService.setEventsCategory(this.form.get('eventsCategory')?.value);

      await this.adminService.addDbpediaData();
      this.events = this.adminService.getAddedEvents();

      console.log(this.events);
  }
}
