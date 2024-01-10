import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";


@Component({
  selector: 'app-explore-maps',
  templateUrl: './explore-maps.component.html',
  styleUrls: ['./explore-maps.component.css']
})
export class ExploreMapsComponent implements OnInit {
  ngOnInit(): void {
  }

  // the map variable
  map: any;

  // all markers on map
  markers: google.maps.Marker[] = [];

  // url for the events API
  url = '';

  // events to be displayed on map
  eventsBetweenYears: any[] = [];

  // TODO get values from period selection
  // values obtained from form
  startYear = 0;
  startEra = 'AD';
  endYear = 2000;
  endEra = 'AD';


  // create the map when the component is created
  constructor(private http: HttpClient) {
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
        stylers: [{color: '#F4F3E4'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{color: '#F4F3E4'}]
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
      center: {lat: 51.509865, lng: -0.118092},
      zoom: 8,
      styles: mapStyles
    });
  }


  // get all events in a selected period of time
  getEventsBetweenYears(): void {
    this.url = `http://127.0.0.1:8000/api/events-between-${this.startYear}-${this.startEra}-${this.endYear}-${this.endEra}`

    this.http.get(this.url).subscribe((response: any): any => {
        this.eventsBetweenYears = response.data;
      }
    );

  }


  // submit period of time
  submitYears(): void {
    // clear all info on map
    this.clearMap();
    // get the events to be displayed
    this.getEventsBetweenYears();
    // create markers after a delay, to make sure the http request in getEventsBetweenYears is completed
    setTimeout(() => {
      this.createMarkers();
    }, 200);
  }


  // create markers to be displayed on map
  createMarkers(): void {
    for (const e of this.eventsBetweenYears) {
      // establish coordinates for marker
      let latLng = {lat: Number(e.latitude), lng: Number(e.longitude)};
      // set the position and title for marker
      let marker = new google.maps.Marker({
        position: latLng,
        title: e.title
      })

      // add marker to the array of markers
      this.markers.push(marker);
      //set marker on map
      marker.setMap(this.map)
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
