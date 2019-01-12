import { Component, OnInit } from '@angular/core';
import { QueryRequest } from 'src/app/services/requests/query.request';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'wetr-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styles: []
})
export class DashboardPageComponent implements OnInit {

  queries: Array<QueryRequest> = []

  constructor(private api : ApiService, private router : Router) { }

  async refreshDashboard(){
    this.queries = await this.api.getDashboardQueries()
  }

  async ngOnInit() {
    this.queries = await this.api.getDashboardQueries()
  }
   
}
