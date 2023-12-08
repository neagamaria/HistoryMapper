import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelloMenuComponent } from './hello-menu/hello-menu.component';
import {RouterOutlet} from "@angular/router";
import {HistoricalPeriodsComponent} from "./historical-periods/historical-periods.component";
import { ExploreMapsComponent } from './explore-maps/explore-maps.component';
import {CommonModule} from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    HelloMenuComponent,
    HistoricalPeriodsComponent,
    ExploreMapsComponent,
    FooterComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterOutlet,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
