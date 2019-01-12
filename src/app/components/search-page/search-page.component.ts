import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { Community } from 'src/app/services/DTOs/community';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Station } from 'src/app/services/DTOs/station';


@Component({
  selector: 'wetr-search-page',
  templateUrl: './search-page.component.html',
  styles: []
})
export class SearchPageComponent implements OnInit {

  constructor(private api : ApiService, private formBuilder: FormBuilder, private flash : FlashMessagesService) { }

  form : FormGroup
  loading : boolean = false
  communities : Array<Community>
  stations : Array<Station> = []
  
  filteredCommunities: Observable<Community[]>;

  async ngOnInit() {

    this.communities = await this.api.getCommunities()

    this.form = this.formBuilder.group({
      community: [null, [Validators.required, validateCommunity(this.communities)]]
    });


    this.filteredCommunities = this.form.get("community").valueChanges
      .pipe(
        startWith(''),
        map(input => this._filter(input))
      );
  }

  private _filter(input: string): Community[] {
    const filterValue = input.toLowerCase();
    return this.communities.filter(community => community.Name.toLowerCase().includes(filterValue))
  }

  async searchForStations(name){
    
    if(this.form.valid){
      let community : Community = this.communities.find(c => c.Name == name)
      this.loading = true
      this.stations = await this.api.getStationsForCommunity(community.CommunityId)
      this.loading = false
    }
    
  }

}


/* Custom validator for communities */
function validateCommunity(communities: Array<Community>): ValidatorFn {

  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (communities.filter(c => c.Name == control.value).length == 1) {
      return null
    }
    return {"key": false}
  }
  }



