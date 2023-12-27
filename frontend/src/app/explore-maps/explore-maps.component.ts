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

  // url for the events API
  url = '';

  // events
  eventsBetweenYears: any[] = [];

  // TODO get values from period selection
  // values obtained from form
    startYear = 900;
    startEra = 'AD';
    endYear = 1000;
    endEra = 'AD';


  // create the map when the component is created
  constructor(private http: HttpClient) {
    this.initMap();
  }

  // promise object to produce value at some point in time
  async initMap(): Promise<void> {
    const {Map} = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;

     // the styles array for the map
    const mapStyles: google.maps.MapTypeStyle[] = [
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#D2E5E4' }]
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ color: '#F4F3E4' }]
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#F4F3E4' }]
    },
    {
    featureType: 'road',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
    },
    {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
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
    this.getEventsBetweenYears();
  }

}

