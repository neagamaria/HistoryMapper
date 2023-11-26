import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HistoricalPeriodsComponent} from "./historical-periods/historical-periods.component";
import {AppComponent} from "./app.component";
import {HelloMenuComponent} from "./hello-menu/hello-menu.component";

const routes: Routes = [
  { path: '', component: HelloMenuComponent },
  { path: 'historical-periods', component: HistoricalPeriodsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
