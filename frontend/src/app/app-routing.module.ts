import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HistoricalPeriodsComponent} from "./pages/public/historical-periods/historical-periods.component";
import {AppComponent} from "./app.component";
import {HelloMenuComponent} from "./pages/public/hello-menu/hello-menu.component";
import {ExploreMapsComponent} from "./pages/public/explore-maps/explore-maps.component";
import {RegisterComponent} from "./pages/public/register/register.component";
import {LoginComponent} from "./pages/public/login/login.component";
import {HistoricalPeriodInfoComponent} from "./pages/public/historical-period-info/historical-period-info.component";
import {QuizzesComponent} from "./pages/private/quizzes/quizzes.component";
import {QuizQuestionsComponent} from "./pages/private/quiz-questions/quiz-questions.component";
import {AdminPageComponent} from "./pages/private/admin-page/admin-page.component";
import {MapOptionsMenuComponent} from "./pages/public/map-options-menu/map-options-menu.component";


const routes: Routes = [
  { path: '', component: HelloMenuComponent },
  { path: 'historical-periods', component: HistoricalPeriodsComponent },
  { path: 'historical-period-info', component: HistoricalPeriodInfoComponent},
  { path: 'explore-maps', component: ExploreMapsComponent },
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'quizzes', component: QuizzesComponent},
  {path: 'quiz-questions', component: QuizQuestionsComponent},
  {path: 'admin-page', component: AdminPageComponent},
  {path: 'map-options-menu', component: MapOptionsMenuComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
