import {Component, OnInit} from '@angular/core';

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

  // create the map when the component is created
  constructor() {
    this.initMap();
  }

  // promise object to produce value at some point in time
  async initMap(): Promise<void> {
    const {Map} = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    this.map = new Map(document.getElementById("map") as HTMLElement, {
      // coordinates of London
      center: {lat: 51.509865, lng: -0.118092},
      zoom: 8,
    });
  }
}

