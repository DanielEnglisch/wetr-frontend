import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { EditStationComponent } from './components/edit-station/edit-station.component';
import { AddStationComponent } from './components/add-station/add-station.component';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { DashboardPageComponent } from './components/dashboard-page/dashboard-page.component';
import { QueryPageComponent } from './components/query-page/query-page.component';


const routes: Routes = [
  { path: "", component: HomeComponent},
  { path: "login", component: LoginComponent},
  { path: "edit/:id", component: EditStationComponent},
  { path: "add", component: AddStationComponent},
  { path: "search", component: SearchPageComponent},
  { path: "dashboard", component: DashboardPageComponent},
  { path: "query/:id", component: QueryPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
export const routingComponents = [LoginComponent, HomeComponent, EditStationComponent, AddStationComponent,SearchPageComponent,DashboardPageComponent, QueryPageComponent]