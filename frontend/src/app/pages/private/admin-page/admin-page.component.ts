import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HistoricalPeriodsService} from "../../../services/historical-periods.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit{

  url: string = 'http://127.0.0.1:8000/api/dpedia/';

  ngOnInit() {

  }


}
