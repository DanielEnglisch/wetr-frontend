import { Injectable } from '@angular/core';

const localStorageKey = "wetr_settings"

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { }

  private settings: SettingsType = { };

  loadSettings() : SettingsType{

    let settings = JSON.parse(localStorage.getItem(localStorageKey))
    if(settings == undefined){
      return {}
    }
    return settings
  }
  

  saveSettings(settings : SettingsType){
    localStorage.setItem(localStorageKey, JSON.stringify(settings))
  }

}

export interface SettingsType{
   [key: string]: boolean
}
