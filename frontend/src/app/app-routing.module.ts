import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HistoricalPeriodsComponent} from "./pages/public/historical-periods/historical-periods.component";
import {AppComponent} from "./app.component";
import {HelloMenuComponent} from "./pages/public/hello-menu/hello-menu.component";
import {ExploreMapsComponent} from "./pages/public/explore-maps/explore-maps.component";
import {RegisterComponent} from "./pages/public/register/register.component";
import {LoginComponent} from "./pages/public/login/login.component";
import {HistoricalPeriodInfoComponent} from "./pages/public/historical-period-info/historical-period-info.component";

const routes: Routes = [
  { path: '', component: HelloMenuComponent },
  { path: 'historical-periods', component: HistoricalPeriodsComponent },
  { path: 'historical-period-info', component: HistoricalPeriodInfoComponent},
  { path: 'explore-maps', component: ExploreMapsComponent },
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
