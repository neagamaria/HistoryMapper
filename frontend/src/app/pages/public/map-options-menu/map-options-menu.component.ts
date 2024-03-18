import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-map-options-menu',
  templateUrl: './map-options-menu.component.html',
  styleUrls: ['./map-options-menu.component.css']
})
export class MapOptionsMenuComponent {

    //determine if menu is opened or not
    menuOpened:boolean = false;

    constructor(private http: HttpClient) {}

    openMenu() {
      this.menuOpened = true;
    }

    closeMenu() {
      this.menuOpened = false;
    }
}
