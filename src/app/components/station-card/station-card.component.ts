import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Station } from 'src/app/services/DTOs/station';
import { ApiService } from 'src/app/services/api.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'wetr-station-card',
  templateUrl: './station-card.component.html',
  styles: []
})
export class StationCardComponent implements OnInit {

  @Input("station") station : Station
  @Input("detailsOnly") detailsOnly : boolean
  @Output() refreshRequired = new EventEmitter<boolean>();

  constructor(private api : ApiService, private flash : FlashMessagesService) { }

  ngOnInit() {
  }

  async deleteStation(id : number){
    
    if(await this.api.deleteStation(id) == true){
      this.flash.show("Deletion successful.",  { cssClass: 'alert-success', timeout: 2000 })

      /* Reload stations */
      this.refreshRequired.emit(true)

    }else{
      this.flash.show("Only own stations without associated measurements can be deleted!",  { cssClass: 'alert-danger', timeout: 2000 })
    }
  }

}
