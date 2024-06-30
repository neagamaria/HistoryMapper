import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelloMenuComponent } from './pages/public/hello-menu/hello-menu.component';
import {RouterOutlet} from "@angular/router";
import {HistoricalPeriodsComponent} from "./pages/public/historical-periods/historical-periods.component";
import { ExploreMapsComponent } from './pages/public/explore-maps/explore-maps.component';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { FooterComponent } from './pages/public/footer/footer.component';
import { HeaderComponent } from './pages/public/header/header.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { RegisterComponent } from './pages/public/register/register.component';
import { LoginComponent } from './pages/public/login/login.component';
import { HistoricalPeriodInfoComponent } from './pages/public/historical-period-info/historical-period-info.component';
import { QuizzesComponent } from './pages/private/quizzes/quizzes.component';
import { QuizQuestionsComponent } from './pages/private/quiz-questions/quiz-questions.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { AdminPageComponent } from './pages/private/admin-page/admin-page.component';
import { MapOptionsMenuComponent } from './pages/public/map-options-menu/map-options-menu.component';
import { EventInfoComponent } from './pages/public/event-info/event-info.component';
import { ProfileComponent } from './pages/private/profile/profile.component';
import { SpinnerComponent } from './pages/public/spinner/spinner.component';
import { MapLegendComponent } from './pages/public/map-legend/map-legend.component';

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
    HistoricalPeriodInfoComponent,
    QuizzesComponent,
    QuizQuestionsComponent,
    AdminPageComponent,
    MapOptionsMenuComponent,
    EventInfoComponent,
    ProfileComponent,
    SpinnerComponent,
    MapLegendComponent
  ],
  imports: [
    BrowserModule,
    NgxSliderModule,
    AppRoutingModule,
    HttpClientModule,
    RouterOutlet,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
