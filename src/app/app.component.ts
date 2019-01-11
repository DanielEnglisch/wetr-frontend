import { Component } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'wetr-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {
  title = 'Wetr';
  constructor(private api: ApiService){
    
  }
}
