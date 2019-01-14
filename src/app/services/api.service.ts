import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginRequest } from './requests/login.request';
import { TokenResponse } from './responses/token.response';
import { Station } from './DTOs/station';
import { StationType } from './DTOs/stationtype';
import { Community } from './DTOs/community';
import { MeasurementType } from './DTOs/measurementType';
import { QueryRequest } from './requests/query.request';


const apiString: string = "http://localhost:5000/v1"

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  private staticDataLoaded: boolean = false

  /* Static data: */
  stationTypes: Array<StationType>
  communities: Array<Community>
  measurementTypes: Array<MeasurementType>

  public reductionTypes: Array<KVPair> = [
    { key: 0, value: "Average" },
    { key: 1, value: "Minimum" },
    { key: 2, value: "Maximum" },
    { key: 3, value: "Sum" },
  ]

  public groupingTypes: Array<KVPair> = [
    { key: 4, value: "Hour" },
    { key: 0, value: "Day" },
    { key: 1, value: "Week" },
    { key: 2, value: "Month" },
    { key: 3, value: "Year" },

  ]


  localStorageData: WetrLocalStorageData

  constructor(private http: HttpClient, private router: Router) {

    /* Create if not exists */
    if (localStorage.getItem("wetr") == undefined) {
      localStorage.setItem("wetr", JSON.stringify({
        email: undefined,
        token: undefined,
        queries: []
      }))
      console.log("LocalStorage data has been initialized for the first time!")
    }

    this.localStorageData = JSON.parse(localStorage.getItem("wetr"))


  }

  private async loadStaticData() {

    if (this.staticDataLoaded) {
      return;
    }


    try {
      /* Load Data */
      this.stationTypes = <Array<StationType>>await this.Get(apiString + "/data/stationtypes")
      this.communities = <Array<Community>>await this.Get(apiString + "/data/communities")
      this.measurementTypes = <Array<MeasurementType>>await this.Get(apiString + "/data/measurementtypes")
    } catch (error) {
      this.router.navigate(['/login'])
    }


    /* Sorting communities */

    this.communities.sort(function (a, b) {
      if (a.Name < b.Name) { return -1; }
      if (a.Name > b.Name) { return 1; }
      return 0;
    })

    console.log("Fetched static data!")

    this.staticDataLoaded = true

  }

  public async revolveStationType(id: number) {
    await this.loadStaticData()
    return this.stationTypes.find(t => t.StationTypeId == id).Name
  }

  public async resolveCommunity(id: number) {
    await this.loadStaticData()
    return this.communities.find(t => t.CommunityId == id).Name
  }

  public async getCommunities() {
    await this.loadStaticData()
    return this.communities
  }

  public async getStationTypes() {
    await this.loadStaticData()
    return this.stationTypes
  }

  public async getMeasurementTypes() {
    await this.loadStaticData()
    return this.measurementTypes
  }

  public loggedIn(): boolean {
    return this.localStorageData.token != null
  }

  public logout() {
    this.localStorageData.token = null
    this.localStorageData.email = null
    this.saveLocalStorage()
    this.router.navigate(["/login"])
  }


  public addQueryToDashboard(query: QueryRequest) {

    /* If there is no query entry */
    let entry = this.localStorageData.queries.find(pair => pair.key == this.localStorageData.email)
    if (entry == undefined) {
      this.localStorageData.queries.push({
        key: this.localStorageData.email,
        value: [query]
      })
    } else {
        entry.value.push(query)
    }

    this.saveLocalStorage()
  }

 

  public getDashboardQueries() {

    /* Only logged in users can view dashboard */
    if (this.localStorageData.token == null) {
      this.router.navigate(["/login"])
      return []
    }

    let pair = this.localStorageData.queries.find(pair => pair.key == this.localStorageData.email)
    if (pair == undefined)
      return []
    return pair.value
  }

  public removeQueryToDashboard(query: QueryRequest) {
    let pair = this.localStorageData.queries.find(pair => pair.key == this.localStorageData.email)
    if (pair == undefined)
      return

    const index = pair.value.indexOf(query, 0);
    if (index > -1) {
      pair.value.splice(index, 1);
    }

    this.saveLocalStorage()
  }

  public saveLocalStorage() {
    localStorage.setItem("wetr", JSON.stringify(this.localStorageData))
  }

  public async login(request: LoginRequest) {

    this.logout()

    let response: HttpResponse<object>

    try {
      response = await this.http.post(apiString + "/auth/", request, { observe: 'response' }).toPromise()
    } catch (error) {
      return false
    }

    let payload = <TokenResponse>response.body
    this.localStorageData.token = payload.Token
    this.localStorageData.email = request.Email

    this.saveLocalStorage()


    /* Load data in login */
    await this.loadStaticData()

    return true

  }

  /***
   * Auto Authorizing PUT request
   */
  private async JwtPut(url: string, body: any) {

    /* If there is no token, login */
    if (this.localStorageData.token == null) {
      this.router.navigate(['/login'])
      throw new Error();
    }

    let headers = new HttpHeaders();
    headers = headers.append("Authorization", this.localStorageData.token);
    let response = await this.http.put(url, body, { headers: headers, observe: 'response' }).toPromise();

    if (response.status == 401) {
      this.router.navigate(['/login'])
    }

    return response

  }

  /***
 * Auto Authorizing POST request
 */
  private async JwtPost(url: string, body: any) {

    /* If there is no token, login */
    if (this.localStorageData.token == null) {
      this.router.navigate(['/login'])
      throw new Error();
    }

    let headers = new HttpHeaders();
    headers = headers.append("Authorization", this.localStorageData.token);
    let response = await this.http.post(url, body, { headers: headers, observe: 'response' }).toPromise();

    if (response.status == 401) {
      this.router.navigate(['/login'])
    }

    return response

  }


  /***
* Auto Authorizing POST request
*/
  private async Post(url: string, body: any) {

    let headers = new HttpHeaders();
    let response = await this.http.post(url, body, { observe: 'response' }).toPromise();

    if (response.status == 401) {
      this.router.navigate(['/login'])
    }

    return response

  }


  /***
   * Auto Authorizing GET request
   */
  private async JwtGet(url: string) {

    /* If there is no token, login */
    if (this.localStorageData.token == null) {
      this.router.navigate(['/login'])
      throw new Error();
    }

    let headers = new HttpHeaders();
    headers = headers.append("Authorization", this.localStorageData.token);
    let response = await this.http.get(url, { headers: headers, observe: 'response' }).toPromise();

    if (response.status == 401) {
      this.router.navigate(['/login'])
      throw new Error();
    }

    return response.body

  }

  private async Get(url: string) {


    let response = await this.http.get(url, { observe: 'response' }).toPromise();

    if (response.status == 401) {
      this.router.navigate(['/login'])
      throw new Error();
    }

    return response.body

  }

  /***
   * Auto Authorizing DELETE request
   */
  private async JwtDelete(url: string) {

    /* If there is no token, login */
    if (this.localStorageData.token == null) {
      this.router.navigate(['/login'])
      throw new Error();
    }

    let headers = new HttpHeaders();
    headers = headers.append("Authorization", this.localStorageData.token);
    let response = await this.http.delete(url, { headers: headers, observe: 'response' }).toPromise();

    if (response.status == 401) {
      this.router.navigate(['/login'])
    }

    return response.status

  }

  public async editStatoin(station: Station) {
    let response
    try {
      response = await this.JwtPut(apiString + "/stations", station)

    } catch (error) {
      return error.error

    }

    return true

  }


  public async addStation(station: Station) {
    let response
    try {
      response = await this.JwtPost(apiString + "/stations", station)

    } catch (error) {
      return error.error

    }

    return true

  }

  public async queryStation(query: QueryRequest) {

    let response
    try {
      response = await this.Post(apiString + "/measurements/query", query)

    } catch (error) {
      return error.error

    }

    return <Array<number>>response.body

  }

  public async deleteStation(id: number) {

    let status
    try {
      status = await this.JwtDelete(apiString + "/stations/" + id)
    } catch (error) {

    }

    return status == 200


  }

  public async getStation(id: number) {
    let response;
    try {
      response = <Station>await this.Get(apiString + "/stations/" + id)
    } catch (error) {
      this.router.navigate(['/login'])
      return null
    }
    return <Station>response
  }

  public async getMyStations() {

    let response;
    try {
      response = <Array<Station>>await this.JwtGet(apiString + "/stations/my")
    } catch (error) {
      this.router.navigate(['/login'])
      return []
    }
    return <Array<Station>>response

  }




  public async getStationsForCommunity(communityId: number) {

    let response;
    try {
      response = <Array<Station>>await this.Get(apiString + "/stations/community/" + communityId)
    } catch (error) {
      this.router.navigate(['/login'])
      return []
    }
    return <Array<Station>>response

  }

}

export interface KVPair {
  key: number
  value: string
}

export interface KVQuery {
  key: string
  value: Array<QueryRequest>
}

export interface WetrLocalStorageData {

  email: string
  token: string
  queries: Array<KVQuery>

}