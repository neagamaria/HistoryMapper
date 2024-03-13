import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Options} from '@angular-slider/ngx-slider';


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


  // create the map when the component is created
  constructor(private http: HttpClient) {
  }

  ngOnInit() {
     // place markers only after map was initialized
    this.initMap().then(() => {
      this.submitYears();
    });
  }


  // promise object to produce value at some point in time
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
      //{
      // featureType: 'landscape.natural',
      // elementType: 'geometry',
      // stylers: [{ color: '#DDF6E4' }]
      // },
    ];

    this.map = new Map(document.getElementById("map") as HTMLElement, {
      // coordinates of London
      center: {lat: 49.8038, lng: 15.4749},
      zoom: 5,
      styles: mapStyles
    });
  }


  // get all events in a selected period of time
  getEventsBetweenYears(): void {
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

    console.log(this.startYear);

    this.url = `http://127.0.0.1:8000/api/events-between-${this.startYear}-${this.startEra}-${this.endYear}-${this.endEra}`

    this.http.get(this.url).subscribe((response: any): any => {
        this.eventsBetweenYears = response.data;
      }
    );

    console.log(this.eventsBetweenYears);
  }

  // submit period of time
  submitYears(): void {
    // clear all info on map
    this.clearMap();
    // get the events to be displayed
    this.getEventsBetweenYears();
    // create markers after a delay, to make sure the http request in getEventsBetweenYears is completed
    setTimeout(() => {
      this.createMarkers(this.map);
    }, 1000);
  }


  // create markers to be displayed on map
  createMarkers(map: any): void {
    this.clearMap();
    for (const e of this.eventsBetweenYears) {
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
}
