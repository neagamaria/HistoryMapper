import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
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

  // mark if response is loading
  loading: boolean = false;

  // all markers on map
  markers: [google.maps.marker.AdvancedMarkerElement, any][] = [];

  // all paths on map
  paths: google.maps.Polyline[] = [];

  // url for the events API
  url = '';

  // events to be displayed on map
  eventsBetweenYears: any[] = [];

  // values obtained from form
  startYear = 0;
  startEra = 'AD';
  endYear = 0;
  endEra = 'AD';

  // saved filters for events
  savedFilters: any = [];

  // keep routes mode status (on or off)
  routesMode: boolean = false;

  // events creating a route
  route: any = [];

  // google.maps path connecting events
  path: google.maps.Polyline = new google.maps.Polyline;

  // marker that an event is clicked or not
  isEventClicked: boolean = false;
  constructor(private http: HttpClient, private eventsService: EventsService, private cdr: ChangeDetectorRef) {
  }


  async ngOnInit() {
    // get starting range for timeline
    this.minVal = this.eventsService.getMinVal();
    this.maxVal = this.eventsService.getMaxVal();

    // always get routes mode status; subscribe to observable to see any change
    this.eventsService.getRoutesMode().subscribe(async (status) => {
      if (status != this.routesMode) {
        this.routesMode = status;
        // change listeners for markers
        this.addListeners(this.map, this.markers).then();
      } else {
        this.routesMode = status;
      }

      if (!this.routesMode) {
        this.clearPath();
        await this.initMap("1edbd100b2d6466a").then(() => {
          // add markers according to zoom level if not in routes mode
          if (this.map.zoom > 4)
            this.createMarkers(this.map, this.eventsBetweenYears);
          else
            this.createGroupMarkers(this.map, this.eventsBetweenYears);
        });
      } else {
        await this.initMap("a9142f4c77c25686").then(() => {
          // change zoom level if in routes mode
          this.map.zoom = 5;
          // create individual markers
          this.createMarkers(this.map, this.eventsBetweenYears);
        });
      }
    })

    // subscribe to observable provided in service to see any change
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

    // subscribe to observable to see any change
    this.eventsService.getClickedEvent().subscribe(async (clickedEvent: any) => {
      this.isEventClicked = (clickedEvent !== null);
      // change detection triggered manually
      this.cdr.detectChanges();
      console.log("Is event clicked: ", this.isEventClicked);
    })

    // place markers only after map was initialized
    this.initMap("1edbd100b2d6466a").then(() => {
      this.submitYears();
    });
  }


  // initialize the map object
  async initMap(id: string): Promise<void> {
    // mark that resource is loading
    this.loading = true;
    this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      // coordinates for London
      center: {lat: 49.8038, lng: 15.4749},
      zoom: 4,
      mapId: id
    }) as google.maps.MapOptions;

    // add on-zoom-change listener only if not in routes mode
    if(!this.routesMode) {
        this.map.addListener("zoom_changed", () => {
            this.clearMap();

          if(this.map.zoom > 4) {
            this.createMarkers(this.map, this.eventsBetweenYears);
          }
          else {
            this.createGroupMarkers(this.map, this.eventsBetweenYears);
          }
        });
    }

    this.loading = false;
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
    // update events
    this.eventsBetweenYears = filteredEvents;
    // replace them on map
    this.createMarkers(this.map, this.eventsBetweenYears).then();
  }


  // get all events in a selected period of time
  async getEventsBetweenYears() {
    this.loading = true;
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

    this.eventsBetweenYears = [];

    // get events with the service method
    await this.eventsService.callEventsBetweenYearsApi(this.startYear, this.startEra, this.endYear, this.endEra);
    this.eventsBetweenYears = this.eventsService.getEventsBetweenYearsValue();

    if(this.eventsBetweenYears.length > 500) {
      // prevent app crashing due to too many events
      this.eventsBetweenYears = this.eventsBetweenYears.slice(0, 500);
      alert("Data is sliced due to too many events");
    }
    this.loading = false;
  }


  // submit period of time
  async submitYears() {
    // clear all info on map
    this.clearMap();
    // get the events to be displayed
    await this.getEventsBetweenYears().then(() => {
      // create markers to be placed on map
      if (this.map.zoom > 4)
        this.createMarkers(this.map, this.eventsBetweenYears);
      else
        this.createGroupMarkers(this.map, this.eventsBetweenYears);
    });
  }


  // create markers for single events
  async createMarkers(map: any, events: any) {
    // create dictionary for marker collisions
    const dict: { [key: string]: number } = {};

    await google.maps.importLibrary("marker");

    for (const e of events) {

      // check if collisions exist
      if(e.location in dict) {
        dict[e.location] += 1;
      }
      else {
        dict[e.location] = 0;
      }

      // establish coordinates for marker, considering collisions behaviour
      let latLng = {lat: Number(e.latitude)  + dict[e.location] / 10, lng: Number(e.longitude) + dict[e.location] / 10};
      //establish data to be displayed on map
      let data = e.name + " (" + e.event_date + " " + e.era + ") ";
      // if routes mode is on, add number of the event in the list
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
      // add marker to the array of markers
        this.markers.push([marker, e]);
      }

      // add additional listeners
      await this.addListeners(map, events);
  }


  // create markers for groups of events
  async createGroupMarkers(map: any, events: any) {
    await google.maps.importLibrary("marker");

    if(this.eventsBetweenYears.length > 0) {
      // get clusters
      let response = await this.eventsService.callClusterEventsAPI(events);

      console.log(response);

      for (let i = 0; i < response.centroids.length; i++) {
        let c = response.centroids[i];

        // establish coordinates for marker
        let latLng = {lat: Number(c[0]), lng: Number(c[1])};

        // create label
        const pin = new google.maps.marker.PinElement({
          background: "#B83333",
          borderColor: "white",
          scale: 1.6,
          glyph: "+" + response.numbers[i].toString()
        });

        // set the position and title for marker
        const marker = new google.maps.marker.AdvancedMarkerElement({
          map: map,
          position: latLng,
          title: response.numbers[i].toString() + " events",
          content: pin.element,
        })

        this.markers.push([marker, c]);
      }
    }
  }


  // add listeners to map based on option
  async addListeners(map: any, events: any) {
    for (let marker of this.markers) {
      console.log("length of markers: ", this.markers.length);
      // remove all previous listeners
      google.maps.event.clearListeners(marker[0], 'click');

      if (!this.routesMode) {
        // make info window appear on click
        google.maps.event.addListener(marker[0], "click", () => {
          this.clickEvent(marker[1]);
        });
      } else {
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

      if (event.length > 0) {
        this.createMarkers(this.map, event).then();
      } else {
        alert("Event does not exist");
      }
    } catch (exception) {
      console.error("Error: ", exception);
    }
  }


  // open page with event info on click
  clickEvent(e: any) {
    this.eventsService.setClickedEvent(e);
    this.cdr.detectChanges();
  }

  // get route based on event
  async getRoute(categoryId: string, eventTypeId: string) {
    try {
      await this.eventsService.callRoutesAPI(categoryId, eventTypeId).then((response) => {
        this.route = response;
      });

      await this.displayPath(this.map, this.route);
    } catch (exception) {
      console.error("Error: ", exception);
    }
  }


  // display the route on map
  async displayPath(map: any, routeEvents: any[]) {
    // remove previous paths
    this.clearPath();

    if (routeEvents.length > 1) {
      for (let i = 0; i < routeEvents.length; i++) {
        // create current markers
        await this.createMarkers(map, [routeEvents[i]]);
        // establish coordinates for the last two markers
        if (i > 0) {
          const coordinates = [
            {lat: Number(routeEvents[i - 1].latitude), lng: Number(routeEvents[i - 1].longitude)},
            {lat: Number(routeEvents[i].latitude), lng: Number(routeEvents[i].longitude)},
          ];
          // create path as Polyline instance
          const path = new google.maps.Polyline({
            path: coordinates,
            geodesic: true,
            strokeColor: "#BE8F7A",
            strokeOpacity: 0.4,
            strokeWeight: 5,
          });

          // add paths with a short delay
          setTimeout(() => { path.setMap(map); }, 300 * i);
          setTimeout(() => {
            path.setOptions({ strokeOpacity: 0.8, strokeColor: "#A06355"});
          }, 500 * i);

          // push path to list of saved paths
          this.paths.push(path);
        }
      }
    }
  }


  // remove paths from map
  clearPath() {
    for(let p of this.paths) {
      p.setMap(null);
    }
    this.paths = [];
  }

  // deactivate routes mode
  exitRoutesMode() {
    this.eventsService.setRoutesMode(false);
  }
}
