import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ItemsService } from 'src/app/services/items.service';
import { UserService } from 'src/app/services/user.service';
import { ISensor } from 'src/app/shared/interfaces/ISensor';
import { Item } from 'src/app/shared/models/Item';
import { User } from 'src/app/shared/models/User';



@Component({
  selector: 'app-found-items-page',
  templateUrl: './found-items-page.component.html',
  styleUrls: ['./found-items-page.component.css']
})
export class FoundItemsPageComponent{

  
  user!:User;
  items: Item[] = [];
  router: any;
  returnUrl = '/';

  // ngOnInit() {
  //   // Call LedEdit() when needed
  //   this.updateLED();
  // }

  
  constructor(
    private itemService:ItemsService,
    private activatedRoute: ActivatedRoute, 
    private userService:UserService,) {
    let ItemsObservable: Observable<Item[]>;
    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });

    activatedRoute.params.subscribe((params) => {
      if (params.searchTerm){
        ItemsObservable = this.itemService.getFoundItemsBySearchTerm(params.searchTerm);
      }
      else{
        ItemsObservable = itemService.getFoundItems();
      }
    ItemsObservable.subscribe((serverItems) => {
      this.items = serverItems;
    })
  })
  }

  get isAdmin(){
    return ("6535010718dcee614802f3a3"===this.user.id);
  }

  get isAuth(){
    return this.user.token;
  }

  // updateLED(){

  //   const led_value: ISensor = {
  //     sensor_id: "led_1",
  //     description: "This is our LED", 
  //     location: "Inside the bedroom",
  //     enable: true,
  //     type: "toggle",
  //     value: "",
  //   };

  //   this.userService.LedEdit(led_value).subscribe(
  //     sensors => {
  //       // Handle success
  //       console.log('Edit Successful', sensors);
  //     },
  //     error => {
  //       // Handle error
  //       console.error('Edit Failed', error);
  //     }
  //   );
  
  // }

  
}
