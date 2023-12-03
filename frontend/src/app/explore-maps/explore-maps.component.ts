import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-explore-maps',
  templateUrl: './explore-maps.component.html',
  styleUrls: ['./explore-maps.component.css']
})
export class ExploreMapsComponent implements OnInit{
  ngOnInit(): void {
  }

  map: any;

  constructor() {
    this.initMap();
  }

  async initMap(): Promise<void> {
    const{Map} = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
     this.map = new Map(document.getElementById("map") as HTMLElement, {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
  });
  }
}

