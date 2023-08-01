import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisplaySkillsComponent } from './display-skills/display-skills.component';

const routes: Routes = [
  { path: 'skills', component: DisplaySkillsComponent },
  { path: '', redirectTo: 'skills', pathMatch: 'full' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
