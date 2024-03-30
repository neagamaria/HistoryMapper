import {Component, OnInit} from '@angular/core';
import {EventsService} from "../../../services/events.service";

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.css']
})
export class EventInfoComponent implements OnInit{

  // event for which info will be displayed
  event: any = [];
  constructor(private eventsService: EventsService) {}

  ngOnInit() {
    this.event = this.eventsService.getClickedEvent();
  }

  close() {
    this.eventsService.setClickedEvent(null);
  }
}
