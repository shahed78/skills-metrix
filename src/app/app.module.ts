import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DisplaySkillsComponent } from './display-skills/display-skills.component';
import { AddSkillsComponent } from './add-skills/add-skills.component';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import { UploadSkillsComponent } from './upload-skills/upload-skills.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip'; 
import { MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { HttpClientModule } from '@angular/common/http';
import { SkillsService } from './shared/services/skills.service';
import { UsersService } from './shared/services/users.service';
import { DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AppToolbarComponent } from './shared/partials/app-toolbar/app-toolbar.component';
import { SpinnerComponent } from './shared/partials/spinner/spinner.component';
import { DataAnalyticsComponent } from './data-analytics/data-analytics.component';
import { ChartModule } from 'primeng/chart';



@NgModule({
  declarations: [
    AppComponent,
    DisplaySkillsComponent,
    AddSkillsComponent,
    DeleteConfirmationComponent,
    UploadSkillsComponent,
    AppToolbarComponent,
    SpinnerComponent,
    DataAnalyticsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatDialogModule,
    MatInputModule,
    MatGridListModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatTableModule,
    MatSelectModule,
    HttpClientModule,
    NgxMatSelectSearchModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    ButtonModule,
    ChartModule

  ],
  providers: [SkillsService, UsersService, DisplaySkillsComponent, DatePipe,  { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
