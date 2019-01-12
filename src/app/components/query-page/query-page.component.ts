import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Station } from 'src/app/services/DTOs/station';
import { MeasurementType } from 'src/app/services/DTOs/measurementType';
import { QueryRequest } from 'src/app/services/requests/query.request';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'wetr-query-page',
  templateUrl: './query-page.component.html',
  styles: []
})
export class QueryPageComponent implements OnInit {

  id: number;
  private sub: any;

  querrying : boolean = false

  reductionTypes = [
    {key: 0, value:"Average"},
    {key: 1, value:"Minimum"},
    {key: 2, value:"Maximum"},
    {key: 3, value:"Sum"},
  ]

  groupingTypes = [
    {key: 4, value:"Hour"},
    {key: 0, value:"Day"},
    {key: 1, value:"Week"},
    {key: 2, value:"Month"},
    {key: 3, value:"Year"},

  ]

  noResults : boolean = false
  chart : Chart = null
  displayedColumns: string[] = ['time', 'value'];
  dataSource : Array<{value:number, time:string}> = [];

  errors : Array<string> = Array<string>()
  measurementTypes : Array<MeasurementType> = []

  form: FormGroup;
  station : Station = { ... new Station(), StationId: -1}

  constructor(private activeRoute: ActivatedRoute, private api : ApiService, private router: Router, private formBuilder: FormBuilder, private flash : FlashMessagesService) {}
  

  async ngOnInit() {

    const routeParams = this.activeRoute.snapshot.params;
    this.id = routeParams.id;
    this.station = await this.api.getStation(this.id)
    this.measurementTypes = await this.api.getMeasurementTypes()

    let today : Date = new Date()
    let lastWeek = new Date()
    lastWeek.setDate(today.getDate()-7)

    this.form = this.formBuilder.group({
      start: [lastWeek, [Validators.required]],
      end: [today, [Validators.required]],
      measurementType: [null, [Validators.required]],
      reductionType: [null, [Validators.required]],
      groupingType: [null, [Validators.required]]

    });

   Object.keys(this.form.controls).forEach(field => {
    const control = this.form.get(field); 
    control.markAsTouched({ onlySelf: true });
  });


  }

  async onSubmit () {

    this.querrying = true

    let data : QueryRequest = {
      MeasurementTypeId: +this.form.get("measurementType").value,
      GroupingTypeId: +this.form.get("groupingType").value,
      ReductionTypeId: +this.form.get("reductionType").value,
      Start: this.form.get("start").value,
      End: this.form.get("end").value,
      StationId: this.station.StationId
    }
  
    let response =<Array<number>> await this.api.queryStation(data)

    let groupingText =  this.groupingTypes.find(g => g.key == data.GroupingTypeId).value

    if(response.length > 0){
      this.chart = new Chart({
        chart: {
          type: 'line'
        },
        title: {
          text: 'Wetr-Query result'
        },
        series: [
          {
            name: "Result",
            data: response
          }
        ],
        xAxis:[{
          title: {
            text: groupingText
          }
        }],
        yAxis:[{
          title: {
            text: this.measurementTypes.find(g => g.MeasurementTypeId == data.MeasurementTypeId).Name
          }
        }]
      });
      
      this.dataSource = []

      var i = 0
      response.forEach(val => {
        this.dataSource.push({
          time: groupingText + " " + i++,
          value: val
        })
      })

      this.noResults = false
    }else{
      this.noResults = true
    }

   
  



    this.querrying = false;

  }


}
