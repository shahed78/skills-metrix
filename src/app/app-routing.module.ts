import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisplaySkillsComponent } from './display-skills/display-skills.component';
import { DataAnalyticsComponent } from './data-analytics/data-analytics.component';

const routes: Routes = [
  { path: 'skills', component: DisplaySkillsComponent },
  { path: 'data-analytics', component: DataAnalyticsComponent },
  { path: '', redirectTo: 'skills', pathMatch: 'full' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
