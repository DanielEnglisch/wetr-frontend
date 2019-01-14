import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ApiService } from './services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './modules/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { EditStationComponent } from './components/edit-station/edit-station.component';
import { AddStationComponent } from './components/add-station/add-station.component';
import { StationCardComponent } from './components/station-card/station-card.component';
import { ChartModule } from 'angular-highcharts';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { QueryPageComponent } from './components/query-page/query-page.component';
import { DashboardPageComponent } from './components/dashboard-page/dashboard-page.component';
import { DashboardCardComponent } from './components/dashboard-card/dashboard-card.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    EditStationComponent,
    AddStationComponent,
    StationCardComponent,
    SearchPageComponent,
    QueryPageComponent,
    DashboardPageComponent,
    DashboardCardComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    FlashMessagesModule.forRoot(),
    ChartModule,
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }

