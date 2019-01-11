import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Station } from 'src/app/services/DTOs/station';
import { Community } from 'src/app/services/DTOs/community';
import { StationType } from 'src/app/services/DTOs/stationtype';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'wetr-edit-station',
  templateUrl: './edit-station.component.html',
  styles: []
})
export class EditStationComponent implements OnInit {

  id: number;
  private sub: any;

  editing : boolean = false

  communities : Array<Community> 
  stationTypes : Array<StationType> 

  errors : Array<string> = Array<string>()


  form: FormGroup;
  station : Station = { ... new Station(), StationId: -1}

  constructor(private activeRoute: ActivatedRoute, private api : ApiService, private router: Router, private formBuilder: FormBuilder, private flash : FlashMessagesService) {}
  

  async ngOnInit() {

    const routeParams = this.activeRoute.snapshot.params;
    this.id = routeParams.id;

    this.station = await this.api.getStation(this.id)
    this.communities = await this.api.getCommunities()
    this.stationTypes = await this.api.getStationTypes()

    this.form = this.formBuilder.group({
      name: [this.station.Name, [Validators.required, Validators.pattern(/^[^-\s][\w\s-]+$/)]],
      community: [this.station.CommunityId, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      location: [this.station.Location, [Validators.required, Validators.pattern(/^[^-\s][\w\s-]+$/)]],
      lat: [this.station.Latitude, [Validators.required, Validators.pattern(/^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/)]],
      lon: [this.station.Longitude, [Validators.required, Validators.pattern(/^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/)]],
      type: [this.station.StationTypeId, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    });

   Object.keys(this.form.controls).forEach(field => {
    const control = this.form.get(field); 
    control.markAsTouched({ onlySelf: true });
  });


  }

  async onSubmit () {

    this.editing = true

    this.errors = new Array<string>()

    let data : Station = {
      ... this.station,
      Name: this.form.get("name").value,
      CommunityId: +this.form.get("community").value,
      Longitude: +this.form.get("lon").value,
      Latitude: +this.form.get("lat").value,
      StationTypeId: +this.form.get("type").value,
      Location: this.form.get("location").value,
    }

  

    let result = await this.api.editStatoin(data)

    if(result == true){
      this.station = await this.api.getStation(this.id)
      this.flash.show("Successfully updated station!",  { cssClass: 'alert-success', timeout: 2000 })
    }else{
      this.flash.show("There was an error updating the station!",  { cssClass: 'alert-danger', timeout: 2000 })

      Object.keys(result).forEach(key => {
        
        (result[key]).forEach(element => this.errors.push(element))
      

    })

  }
    
    this.editing = false;

  }


}
