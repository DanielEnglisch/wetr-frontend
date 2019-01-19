import { Component, OnInit } from '@angular/core';
import { SettingsService, SettingsType } from 'src/app/services/settings.service';

@Component({
  selector: 'wetr-settings',
  templateUrl: './settings.component.html',
  styles: []
})
export class SettingsComponent implements OnInit {

  settings: SettingsType

  constructor(private set: SettingsService) { }

  ngOnInit() {
    this.settings = this.set.loadSettings()
  }



  onChange(event, key: string) {

    this.settings[key] = event.checked
    this.set.saveSettings(this.settings)

  }

}
