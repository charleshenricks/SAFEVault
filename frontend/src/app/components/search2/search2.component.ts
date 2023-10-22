import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search2',
  templateUrl: './search2.component.html',
  styleUrls: ['./search2.component.css']
})
export class Search2Component {
  searchTerm = '';
  constructor(activatedRoute:ActivatedRoute, private router:Router) {
    activatedRoute.params.subscribe((params) => {
      if(params.searchTerm) this.searchTerm = params.searchTerm;
    });
  }

  search(term:string):void{
    if(term){
      this.router.navigateByUrl('lost-items/'+ term);
    }
    else{
      this.router.navigateByUrl('lost-items');
    }
  }
}
