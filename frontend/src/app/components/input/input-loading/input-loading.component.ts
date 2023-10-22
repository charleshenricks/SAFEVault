import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-input-loading',
  templateUrl: './input-loading.component.html',
  styleUrls: ['./input-loading.component.css']
})
export class InputLoadingComponent implements OnInit {

  isLoading!: boolean;
  constructor( loadingService: LoadingService) {
    loadingService.getLoading.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }

  ngOnInit(): void {
  }

}
