import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HistoricalPeriodsComponent} from "./historical-periods/historical-periods.component";

const routes: Routes = [
  {
    path: 'historical-periods', component: HistoricalPeriodsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
