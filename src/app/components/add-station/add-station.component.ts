import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Station } from 'src/app/services/DTOs/station';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { StationType } from 'src/app/services/DTOs/stationtype';
import { Community } from 'src/app/services/DTOs/community';

@Component({
  selector: 'wetr-add-station',
  templateUrl: './add-station.component.html',
  styles: []
})
export class AddStationComponent implements OnInit {


  adding : boolean = false

  communities : Array<Community> 
  stationTypes : Array<StationType> 

  errors : Array<string> = Array<string>()


  form: FormGroup;

  constructor(private activeRoute: ActivatedRoute, private api : ApiService, private router: Router, private formBuilder: FormBuilder, private flash : FlashMessagesService) {}
  

  async ngOnInit() {

    this.communities = await this.api.getCommunities()
    this.stationTypes = await this.api.getStationTypes()

    this.form = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(/^[^-\s][\w\s-]+$/)]],
      community: [null, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      location: [null, [Validators.required, Validators.pattern(/^[^-\s][\w\s-]+$/)]],
      lat: [null, [Validators.required, Validators.pattern(/^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/)]],
      lon: [null, [Validators.required, Validators.pattern(/^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/)]],
      type: [null, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    });


  }

  async onSubmit () {

    this.adding = true

    this.errors = new Array<string>()

    let data : Station = {
      ... new Station(),
      Name: this.form.get("name").value,
      CommunityId: +this.form.get("community").value,
      Longitude: +this.form.get("lon").value,
      Latitude: +this.form.get("lat").value,
      StationTypeId: +this.form.get("type").value,
      Location: this.form.get("location").value,
    }

  

    let result = await this.api.addStation(data)

    if(result == true){
      this.flash.show("Successfully added station!",  { cssClass: 'alert-success', timeout: 2000 })
      this.router.navigate(['/'])
    }else{
      this.flash.show("There was an error adding the station!",  { cssClass: 'alert-danger', timeout: 2000 })

      Object.keys(result).forEach(key => {
        
        (result[key]).forEach(element => this.errors.push(element))
      

    })

  }
    
    this.adding = false;

  }

}
