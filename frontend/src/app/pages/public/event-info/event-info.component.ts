import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {EventsService} from "../../../services/events.service";
// import { YouTubePlayerModule } from '@angular/youtube-player';


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

  constructor(private eventsService: EventsService, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    this.eventsService.getClickedEvent().subscribe(async (clickedEvent: any) => {
      this.event = clickedEvent;
    });

    // obtain videos for current event
    await this.eventsService.callVideosAPI(this.event.name).then((response) => {
        this.videos = response;
        this.cdr.detectChanges();
      });
  }

  close() {
    this.eventsService.setClickedEvent(null);
  }
}
