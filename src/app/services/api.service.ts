import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginRequest } from './requests/login.request';
import { TokenResponse } from './responses/token.response';
import { Station } from './DTOs/station';
import { StationType } from './DTOs/stationtype';
import { Country } from './DTOs/country';
import { District } from './DTOs/district';
import { Community } from './DTOs/community';
import { Province } from './DTOs/province';

const apiString : string = "http://localhost:5000/v1"

@Injectable({
  providedIn: 'root'
})


export class ApiService {

  private token : string = null
  private staticDataLoaded : boolean = false

  /* Static data: */
  public stationTypes : Array<StationType>
  public countries : Array<Country>
  public districts : Array<District>
  public communities : Array<Community>
  public provinces : Array<Province>


  constructor(private http: HttpClient,  private router: Router){

    /* Load token from localStorage */
    this.token = localStorage.getItem("token");

    if(this.token == null){
      console.log("No token found! Requesting login.")
      this.router.navigate(['/login'])
      return;
    }else{
      this.loadStaticData().then(() => {
        router.navigate([router.url])
      })
    }

  }

  private async loadStaticData(){

    if(this.staticDataLoaded){
      return;
    }

    this.staticDataLoaded = true

    try {
        /* Load Data */
        this.stationTypes = <Array<StationType>> await this.JwtGet(apiString + "/data/stationtypes")
        this.countries = <Array<Country>> await this.JwtGet(apiString + "/data/countries")
        this.provinces = <Array<Province>> await this.JwtGet(apiString + "/data/provinces")
        this.districts = <Array<District>> await this.JwtGet(apiString + "/data/districts")
        this.communities = <Array<Community>> await this.JwtGet(apiString + "/data/communities")
    } catch (error) {
      this.router.navigate(['/login'])
    }

    

      console.log("Fetched static data!")


  }

  public  revolveStationType(id : number) {
    return  this.stationTypes.find(t => t.StationTypeId == id).Name
  }

  public  resolveCountry(id : number) {
    return  this.countries.find(t => t.CountryId == id).Name
  }

  public  resolveProvince(id : number) {
    return  this.provinces.find(t => t.ProvinceId == id).Name
  }

  public  resolveDistrict(id : number) {
    return  this.districts.find(t => t.DistrictId == id).Name
  }

  public resolveCommunity(id : number) {
    return this.communities.find(t => t.CommunityId == id).Name
  }

  public  getCommunities() {
    return this.communities
  }

  public  getStationTypes() {
    return this.stationTypes
  }


  public async login(request: LoginRequest ){
  
    let response : HttpResponse<object>

    try {
      response = await this.http.post(apiString + "/auth/",request,{observe: 'response'}).toPromise()
    } catch (error) {
        return false
    }

    let payload = <TokenResponse> response.body
    this.token = payload.Token
    localStorage.setItem("token", this.token)

    /* Load data in login */
    await this.loadStaticData()

    return true
    
  }

  /***
   * Auto Authorizing PUT request
   */
  private async JwtPut(url:string, body : any){

    /* If there is no token, login */
    if(this.token == null){
      this.router.navigate(['/login'])
      throw new Error();
    }

    let headers = new HttpHeaders();
    headers = headers.append("Authorization", this.token);
    let response = await this.http.put(url,  body, {headers: headers, observe: 'response'}).toPromise();

    if(response.status == 401){
      this.router.navigate(['/login'])
    }

    return response

  }

    /***
   * Auto Authorizing POST request
   */
  private async JwtPost(url:string, body : any){

    /* If there is no token, login */
    if(this.token == null){
      this.router.navigate(['/login'])
      throw new Error();
    }

    let headers = new HttpHeaders();
    headers = headers.append("Authorization", this.token);
    let response = await this.http.post(url,  body, {headers: headers, observe: 'response'}).toPromise();

    if(response.status == 401){
      this.router.navigate(['/login'])
    }

    return response

  }

  /***
   * Auto Authorizing GET request
   */
  private async JwtGet(url:string){

    /* If there is no token, login */
    if(this.token == null){
      this.router.navigate(['/login'])
      throw new Error();
    }

    let headers = new HttpHeaders();
    headers = headers.append("Authorization", this.token);
    let response = await this.http.get(url,  {headers: headers, observe: 'response'}).toPromise();

    if(response.status == 401){
      this.router.navigate(['/login'])
      throw new Error();
    }

    return response.body

  }

  /***
   * Auto Authorizing DELETE request
   */
  private async JwtDelete(url:string){

    /* If there is no token, login */
    if(this.token == null){
      this.router.navigate(['/login'])
      throw new Error();
    }

    let headers = new HttpHeaders();
    headers = headers.append("Authorization", this.token);
    let response = await this.http.delete(url,  {headers: headers, observe: 'response'}).toPromise();

    if(response.status == 401){
      this.router.navigate(['/login'])
    }

    return response.status

  }

  public async editStatoin(station : Station){
    let response
    try {
      response = await this.JwtPut(apiString + "/stations", station)

    } catch (error) {
      return error.error

    }

      return true

  }


  public async addStation(station : Station){
    let response
    try {
      response = await this.JwtPost(apiString + "/stations", station)

    } catch (error) {
      return error.error

    }

      return true

  }

  public async deleteStation(id :number){

    let status 
    try {
      status =  await this.JwtDelete(apiString + "/stations/"+id)
    } catch (error) {
      
    }

    return status == 200


  }

  public async getStation(id : number){
    let response;
    try {
      response = <Station>await this.JwtGet(apiString + "/stations/" + id)
    } catch (error) {
      this.router.navigate(['/login'])
      return null
    }
    return  <Station>response
  }

  public async getStations(){

    let response;
    try {
      response = <Array<Station>>await this.JwtGet(apiString + "/stations/my")
    } catch (error) {
      this.router.navigate(['/login'])
      return []
    }
    return  <Array<Station>>response

  }

}
