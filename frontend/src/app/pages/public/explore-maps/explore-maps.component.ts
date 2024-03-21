import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Options} from '@angular-slider/ngx-slider';

import { EventsService } from 'src/app/services/events.service';
import {Subscription} from "rxjs";


@Component({
  selector: 'app-explore-maps',
  templateUrl: './explore-maps.component.html',
  styleUrls: ['./explore-maps.component.css'],
  // to avoid children encapsulation problems
  encapsulation: ViewEncapsulation.None
})


export class ExploreMapsComponent implements OnInit{

  // variables for timeline
  minVal = -100;
  maxVal = 100;
  options: Options = {
    floor: -2000,
    ceil: 2024,
    step: 1,
    //showTicks: true,
    translate: (value: number): string => {
      if (value < 0) {
        return `${-value} BC`;
      } else {
        return `${value} AD`;
      }
    },
  };

  // map variable
  map: any;

  // all markers on map
  markers: google.maps.Marker[] = [];

  // url for the events API
  url = '';

  // events to be displayed on map
  eventsBetweenYears: any[] = [];

  // values obtained from form
  startYear = 0;
  startEra = 'AD';
  endYear = 0;
  endEra = 'AD';

  // mark if error search error message should be displayed
  searchError: boolean = false;



  constructor(private http: HttpClient, private eventsService: EventsService) {
  }


  async ngOnInit() {
     // place markers only after map was initialized
    this.initMap().then(() => {
      this.submitYears();
    });

    // subscribe to observable provided in EventsService to see any change
    let eventSubscription = this.eventsService.getSearchedName().subscribe(async (name) => {
      console.log("Searched name: ", name);
      if (name != "") {
        this.getSearchedEvent().then();
      }
    })
  }


  // initialize the map object
  async initMap(): Promise<void> {
    const {Map} = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;

    // the styles array for the map
    const mapStyles: google.maps.MapTypeStyle[] = [
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{color: '#D2E5E4'}]
      },
      {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [{color: '#EDEAD4'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{color: '#CAC6B1'}]
      },
      {
        featureType: 'road',
        elementType: 'labels',
        stylers: [{visibility: 'off'}]
      },
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{visibility: 'off'}]
      },
    ];

    this.map = new Map(document.getElementById("map") as HTMLElement, {
      // coordinates of London
      center: {lat: 49.8038, lng: 15.4749},
      zoom: 5,
      styles: mapStyles
    });
  }


  // get all events in a selected period of time
  async getEventsBetweenYears() {
    if(this.minVal < 0)
    {
      this.startYear = -this.minVal;
      this.startEra = "BC";
    }
    else
    {
      this.startYear = this.minVal;
      this.startEra = "AD";
    }

    if(this.maxVal < 0)
    {
      this.endYear = -this.maxVal;
      this.endEra = "BC";
    }
    else
    {
      this.endYear = this.maxVal;
      this.endEra = "AD";
    }


    // get events with the service method
    await this.eventsService.callEventsBetweenYearsApi(this.startYear, this.startEra, this.endYear, this.endEra);
    this.eventsBetweenYears = this.eventsService.getEventsBetweenYearsValue();

    console.log(this.eventsBetweenYears);
  }


  // submit period of time
  submitYears(): void {
    // clear all info on map
    this.clearMap();
    // get the events to be displayed
    this.getEventsBetweenYears().then();
    // create markers after a delay, to make sure the http request in getEventsBetweenYears is completed
    setTimeout(() => {
      this.createMarkers(this.map, this.eventsBetweenYears);
    }, 1000);
  }


  // create markers to be displayed on map
  createMarkers(map: any, events: any): void {
    this.clearMap();
    for (const e of events) {
      // establish coordinates for marker
      let latLng = {lat: Number(e.latitude), lng: Number(e.longitude)};
      //establish data to be displayed on map
      let data = e.name + " (" + e.event_date + " " + e.era + ") - " + e.description;
      let infoWindow = new google.maps.InfoWindow({
      content: "<p style='color:black; font-weight: bold; font-family:\'Comfortaa;\''>" + data + "</p>"
    });
      // set the position and title for marker
      let marker = new google.maps.Marker({
        position: latLng,
        title: e.title
      })

      google.maps.event.addListener(marker, 'click', function() {
      infoWindow.open(map,marker);
    });

      // add marker to the array of markers
      this.markers.push(marker);
      //set marker on map
      marker.setMap(map)
    }
  }


  // remove all previous markers from map
  clearMap(): void {
    for(const m of this.markers) {
      m.setMap(null);
    }

    this.markers = [];
  }

  // get searched event if available
  // @ts-ignore
  async getSearchedEvent() {
    try {
      await this.eventsService.callEventByNameApi().then();
      let event = this.eventsService.getSearchedEvent();
      console.log("Searched event:", event)
      if (event) {
        this.createMarkers(this.map, event);
      }
      else {
        this.searchError = true;
      }
    }
    catch (exception) {
      console.error("Error: ", exception)
    }

  }
}
