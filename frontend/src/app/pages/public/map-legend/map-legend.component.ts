import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {EventsService} from "../../../services/events.service";

@Component({
  selector: 'app-map-legend',
  templateUrl: './map-legend.component.html',
  styleUrls: ['./map-legend.component.css']
})
export class MapLegendComponent implements OnInit {

  // all event types in the db
  eventTypes: any = [];

  constructor(private router: Router, private eventsService: EventsService) {}

  async ngOnInit() {
    await this.eventsService.callTypesApi().then(() =>{
      this.eventTypes = this.eventsService.getEventTypes();
    });
  }

  // navigate back to map page
  goToMapPage() {
    this.router.navigate(['/explore-maps']).then();
  }
}
