import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-explore-maps',
  templateUrl: './explore-maps.component.html',
  styleUrls: ['./explore-maps.component.css']
})
export class ExploreMapsComponent implements OnInit{
  constructor() {}
  ngOnInit(): void {}

  display: any;
  center: google.maps.LatLngLiteral = {
     lat:  51.509865,
     lng: -0.118092
  }

  zoom = 3;

  moveMap(event: google.maps.MapMouseEvent) {
    if(event.latLng != null)
      this.center =  (event.latLng.toJSON());
  }


  move(event: google.maps.MapMouseEvent) {
    if(event.latLng != null)
      this.display = event.latLng.toJSON();
  }

}

