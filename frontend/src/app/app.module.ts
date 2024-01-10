import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelloMenuComponent } from './pages/public/hello-menu/hello-menu.component';
import {RouterOutlet} from "@angular/router";
import {HistoricalPeriodsComponent} from "./pages/public/historical-periods/historical-periods.component";
import { ExploreMapsComponent } from './pages/public/explore-maps/explore-maps.component';
import {CommonModule} from '@angular/common';
import { FooterComponent } from './pages/public/footer/footer.component';
import { HeaderComponent } from './pages/public/header/header.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { RegisterComponent } from './pages/public/register/register.component';
import { LoginComponent } from './pages/public/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HelloMenuComponent,
    HistoricalPeriodsComponent,
    ExploreMapsComponent,
    FooterComponent,
    HeaderComponent,
    RegisterComponent,
    LoginComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        RouterOutlet,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
