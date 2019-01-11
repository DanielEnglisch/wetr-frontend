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

  stations : Array<Station>

  constructor(private api : ApiService, private flash : FlashMessagesService) { }

  async ngOnInit() {
    this.stations = await this.api.getStations()
  }

  async deleteStation(id : number){
    
    if(await this.api.deleteStation(id) == true){
      this.flash.show("Deletion successful.",  { cssClass: 'alert-success', timeout: 2000 })

      /* Reload stations */
      this.stations = await this.api.getStations()

    }else{
      this.flash.show("Only stations without associated measurements can be deleted!",  { cssClass: 'alert-danger', timeout: 2000 })
    }
  }

}
