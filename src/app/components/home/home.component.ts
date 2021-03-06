import { Component, OnInit } from '@angular/core';
import { Station } from 'src/app/services/DTOs/station';
import { ApiService } from 'src/app/services/api.service';
import { FlashMessagesService } from 'angular2-flash-messages';


@Component({
  selector: 'wetr-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {

  hideDetails : boolean = false
  stations : Array<Station>

  constructor(private api : ApiService, private flash : FlashMessagesService) { }

  async ngOnInit() {
    await this.refreshStations()
  }

  values: number[] = [1, 2, 3];


  async refreshStations(){
    this.stations = await this.api.getMyStations()
  }
  

}
