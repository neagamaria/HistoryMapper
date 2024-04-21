import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Options} from '@angular-slider/ngx-slider';

import {EventsService} from 'src/app/services/events.service';


@Component({
  selector: 'app-explore-maps',
  templateUrl: './explore-maps.component.html',
  styleUrls: ['./explore-maps.component.css'],
  // to avoid children encapsulation problems
  encapsulation: ViewEncapsulation.None
})


export class ExploreMapsComponent implements OnInit {

  // variables for timeline
  minVal = -100;
  maxVal = 100;
  options: Options = {
    floor: -3800,
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
  markers: [google.maps.marker.AdvancedMarkerElement, any][] = [];

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

  // saved filters for events
  savedFilters: any = [];

  // keep routes mode status (on or off)
  routesMode: boolean = false;

  // events creating a route
  route: Promise<any>[] = [];

  // google.maps path connecting events
  path: google.maps.Polyline = new google.maps.Polyline;

  constructor(private http: HttpClient, private eventsService: EventsService) {
  }


  async ngOnInit() {

    // always get routes mode status; subscribe to observable to see any change
    this.eventsService.getRoutesMode().subscribe(async (status) => {

      if(status != this.routesMode) {
        this.routesMode = status;

        // change listeners for
        this.addListeners(this.map, this.markers).then();

      }
      else {
        this.routesMode = status;
      }

      if(!status) {
          this.clearPath();
          this.initMap("1edbd100b2d6466a").then();
      }
      else {
        await this.initMap("a9142f4c77c25686").then(() => {
          this.createMarkers(this.map, this.eventsBetweenYears).then()
        });
      }
    })

    // subscribe to observable provided in EventsService to see any change
    this.eventsService.getSearchedName().subscribe(async (name) => {
      if (name != "") {
        this.getSearchedEvent().then();
      }
    })

    // subscribe to observable to see any change
    this.eventsService.getSavedFilters().subscribe(async (filters: any[]) => {
      this.savedFilters = filters;
      // if there are filters and events to filter call filtering process
      if (filters && this.eventsBetweenYears) {
        this.filterEvents();
      }
    })

    // place markers only after map was initialized
    this.initMap("1edbd100b2d6466a").then(() => {
      this.submitYears();
    });
  }


  // initialize the map object
  async initMap(id: string): Promise<void> {
    this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      // coordinates of London
      center: {lat: 49.8038, lng: 15.4749},
      zoom: 5,
      mapId: id
    }) as google.maps.MapOptions;
  }


  // filter events based on type
  filterEvents() {
    let filteredEvents = []
    for (let event of this.eventsBetweenYears) {
      let found = this.savedFilters.indexOf(event.event_type);

      if (found > -1) {
        filteredEvents.push(event)
      }
    }
    console.log(filteredEvents)
    // update events
    this.eventsBetweenYears = filteredEvents;
    // replace them on map
    this.createMarkers(this.map, this.eventsBetweenYears).then();
  }


  // get all events in a selected period of time
  async getEventsBetweenYears() {
    if (this.minVal < 0) {
      this.startYear = -this.minVal;
      this.startEra = "BC";
    } else {
      this.startYear = this.minVal;
      this.startEra = "AD";
    }

    if (this.maxVal < 0) {
      this.endYear = -this.maxVal;
      this.endEra = "BC";
    } else {
      this.endYear = this.maxVal;
      this.endEra = "AD";
    }

    this.eventsBetweenYears = []

    // get events with the service method
    await this.eventsService.callEventsBetweenYearsApi(this.startYear, this.startEra, this.endYear, this.endEra);
    this.eventsBetweenYears = this.eventsService.getEventsBetweenYearsValue();
    // filter events by type if filters applied

    console.log("EVENTS: ", this.eventsBetweenYears)
  }


  // submit period of time
  submitYears(): void {
    // clear all info on map
    this.clearMap();
    // get the events to be displayed
    this.getEventsBetweenYears().then();
    // create markers after a delay, to make sure the http request in getEventsBetweenYears is completed
    setTimeout(() => {
      this.createMarkers(this.map, this.eventsBetweenYears).then();
    }, 1000);
  }


  // create markers to be displayed on map
  async createMarkers(map: any, events: any) {
    // this.clearMap();
    await google.maps.importLibrary("marker");

    for (const e of events) {
      // establish coordinates for marker
      let latLng = {lat: Number(e.latitude), lng: Number(e.longitude)};
      //establish data to be displayed on map
      let data = e.name + " (" + e.event_date + " " + e.era + ") ";
      const infoWindow = new google.maps.InfoWindow({
        content: "<p style='color:black; font-weight: bold; font-family:\'Comfortaa;\''>" + data + "</p>"
      });

      const markerImg = document.createElement('img');
      markerImg.src = 'assets/Marker-' + e.event_type + '.png';
      markerImg.width = 43;
      markerImg.height = 43;

      // set the position and title for marker
      let marker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: latLng,
        title: e.title,
        content: markerImg,
      })

      // make name and date appear on mouseover
      marker.content?.addEventListener('mouseenter', function () {
        infoWindow.open(map, marker);
      });

      // make name and date disappear on mouseout
      marker.content?.addEventListener('mouseleave', function () {
        infoWindow.close();
      });

      await this.addListeners(map, events);


      // add marker to the array of markers
      this.markers.push([marker, e]);
    }
  }


  // add listeners to map based on option
  async addListeners(map: any, events: any) {
    for (let marker of this.markers) {
      // remove all previous listeners
      google.maps.event.clearListeners(marker[0], 'click');

      if(!this.routesMode) {
        // make info window appear on click
        google.maps.event.addListener(marker[0], "click", () => {
        this.clickEvent(marker[1]);
        });
      }
      else {
        // get route based on event on click
        google.maps.event.addListener(marker[0], "click", async () => {
          await this.getRoute(marker[1].category_id, marker[1].event_type_id).then();
        });
      }
    }
  }

  // remove all previous markers from map
  clearMap(): void {
    for (const m of this.markers) {
      m[0].map = null;
    }

    this.markers = [];
  }


  // get searched event if available
  async getSearchedEvent() {
    try {
      await this.eventsService.callEventByNameApi().then();
      let event = this.eventsService.getSearchedEvent();

      if (event) {
        this.createMarkers(this.map, event).then();
      } else {
        this.searchError = true;
      }
    } catch (exception) {
      console.error("Error: ", exception);
    }
  }


  // open page with event info on click
  clickEvent(e: any) {
    this.eventsService.setClickedEvent(e);
  }


  isEventClicked() {
    const event = this.eventsService.getClickedEvent();
    return (event != null);
  }


  // get route based on event
  async getRoute(categoryId: string, eventTypeId: string) {
    try {
      await this.eventsService.callRoutesAPI(categoryId, eventTypeId).then((response) => {
        this.route = response;
      });

      await this.displayPath(this.map, this.route);
    }
    catch (exception) {
      console.error("Error: ", exception);
    }
  }


  // display the route on map
  async displayPath(map: any, routeEvents: any[]) {
    // remove previous paths
    this.clearPath();

    if(routeEvents.length > 1) {
      for(let i = 0; i<routeEvents.length; i++) {
        // create current marker
        await this.createMarkers(map, [routeEvents[i]]);
        // create path between the last two markers
        if(i > 0) {
            const coordinates  = [
              { lat: Number(routeEvents[i-1].latitude), lng: Number(routeEvents[i-1].longitude) },
              { lat: Number(routeEvents[i].latitude), lng: Number(routeEvents[i].longitude) },
            ];

            this.path = new google.maps.Polyline({
              path: coordinates,
              geodesic: true,
              strokeColor: "#FFF34F",
              strokeOpacity: 1.0,
              strokeWeight: 3,
            });

            this.path.setMap(map);
        }
      }
    }
  }


  // remove path from map
  clearPath() {
    this.path.setMap(null);
  }
}
