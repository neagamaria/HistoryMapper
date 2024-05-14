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
  // videos for the event
  videos: any = [];

  constructor(private eventsService: EventsService) {}

  ngOnInit() {
    this.event = this.eventsService.getClickedEvent();
  }

  // obtain videos for current event
  obtainVideos() {
    this.eventsService.callVideosAPI(this.event.name).then((response) => {
        this.videos = response;
        console.log(this.videos)
      });
  }

  close() {
    this.eventsService.setClickedEvent(null);
  }
}
