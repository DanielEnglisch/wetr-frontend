import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { QueryRequest } from 'src/app/services/requests/query.request';
import { Chart } from 'angular-highcharts';
import { ApiService } from 'src/app/services/api.service';
import { MeasurementType } from 'src/app/services/DTOs/measurementType';
import { Station } from 'src/app/services/DTOs/station';

@Component({
  selector: 'wetr-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styles: []
})
export class DashboardCardComponent implements OnInit {

  @Input("query") query : QueryRequest 
  @Output() refreshRequired = new EventEmitter<void>();

  isLoading : boolean = false
  chart : Chart = null
  measurementTypes : Array<MeasurementType> = []
  station : Station = new Station
  description:string = "?"

  constructor(private api : ApiService) { }

  async ngOnInit() {

    this.isLoading = true

    let today : Date = new Date()
    let lastWeek = new Date()
    lastWeek.setDate(today.getDate()-7)

    this.query.End = new Date()
    this.query.Start = new Date(this.query.Start)

    if(this.query == undefined){
      this.query = {
        End: today,
        Start: lastWeek,
        GroupingTypeId:0,
        MeasurementTypeId:1,
        ReductionTypeId:0,
        StationId:1
      }
    }


    this.measurementTypes = await this.api.getMeasurementTypes()
    this.station = await this.api.getStation(this.query.StationId)

    let data = await this.api.queryStation(this.query)

    let groupingText =  this.api.groupingTypes.find(g => g.key == this.query.GroupingTypeId).value
    let measurementText = this.measurementTypes.find(g => g.MeasurementTypeId == this.query.MeasurementTypeId).Name

    if(data.length > 0){
      this.chart = new Chart({
        chart: {
          type: 'line'
        },
        title: {
          text: ""
        },
        responsive: {
          rules:[{
            condition:{
              maxHeight:200
            }
          }]
        },
        series: [
          {
            name: "Data",
            data: data
          }
        ],
        xAxis:[{
          title: {
            text: groupingText
          }
        }],
        yAxis:[{
          title: {
            text: measurementText
          }
        }]
      });

      

      var diff = Math.abs(new Date().getTime() - this.query.Start.getTime());
      var diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
 
      this.description = this.api.reductionTypes.find(t => t.key == this.query.ReductionTypeId).value + " " + measurementText + " of the last " + diffDays + " days."
      
    }
    this.isLoading = false

  }

  async deleteQuery(){
    this.api.removeQueryToDashboard(this.query)
    this.refreshRequired.emit()

  }

}
