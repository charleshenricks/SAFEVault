import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ItemsService } from 'src/app/services/items.service';
import { UserService } from 'src/app/services/user.service';
import { Item } from 'src/app/shared/models/Item';
import { User } from 'src/app/shared/models/User';


@Component({
  selector: 'app-lost-items-page',
  templateUrl: './lost-items-page.component.html',
  styleUrls: ['./lost-items-page.component.css']
})
export class LostItemsPageComponent {

  user!:User;
  items: Item[] = [];

  constructor(private itemService:ItemsService, activatedRoute: ActivatedRoute, userService:UserService) {
    let ItemsObservable: Observable<Item[]>;

    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });

    activatedRoute.params.subscribe((params) => {
      if (params.searchTerm){
        ItemsObservable = this.itemService.getLostItemsBySearchTerm(params.searchTerm);
      }
      else{
        ItemsObservable = itemService.getLostItems();
      }
    ItemsObservable.subscribe((serverItems) => {
      this.items = serverItems;
    })
  })
  }

  get isAdmin(){
    return ("642d959eb62173ebc88f3447"===this.user.id);
  }

  get isAuth(){
    return this.user.token;
  }

}
