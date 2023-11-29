import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EspServiceService } from '../app/services/esp-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  newdata:any;

  constructor(private _apiservice:EspServiceService) { }

  ngOnInit() {
	this.getData();
  }

  getData() {
	this._apiservice.getdata().subscribe(res=>{
  	this.newdata=res;
	})
  }
}
