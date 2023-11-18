import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelloMenuComponent } from './hello-menu/hello-menu.component';
import { HistoricalPeriodsComponent } from './historical-periods/historical-periods.component';

@NgModule({
  declarations: [
    AppComponent,
    HelloMenuComponent,
    HistoricalPeriodsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
