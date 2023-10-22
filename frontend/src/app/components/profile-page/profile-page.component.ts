import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ItemsService } from 'src/app/services/items.service';
import { UserService } from 'src/app/services/user.service';
import { IUserRegister } from 'src/app/shared/interfaces/IUserRegister';
import { Item } from 'src/app/shared/models/Item';
import { User } from 'src/app/shared/models/User';


@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent {

  user!: User;
  posts: Item[] = [];
  requests: Item[] = [];
  returnUrl!: string;
  itemUrl!:string;
  editForm!:FormGroup;
  edit = false;

  constructor(private itemService: ItemsService, private router: Router, private userService:
    UserService, private toastrService: ToastrService) { }

  ngOnInit(): void {
      this.userService.userObservable.subscribe((newUser) => {
        this.user = newUser;
        this.user.password = '';
        this.returnUrl = "profile/"+this.user.id;
      });
      this.itemService.getUserPosts(this.user.id).subscribe((userPosts) => {
        this.posts = userPosts;
      });
      this.itemService.getUserRequests(this.user.id).subscribe((userRequests) => {
        this.requests = userRequests;
      });

      this.editForm = new FormGroup({
        Fullname: new FormControl(this.user.Fullname),
        email: new FormControl(this.user.email),
        contactinfo: new FormControl(this.user.contactinfo),
        password: new FormControl(this.user.password),
      });

   // setTimeout(() => { this.ngOnInit() }, 1000 * 100);
  }

  Save(){
    const formData = this.editForm.value;
    if((this.user.Fullname===formData.Fullname)&&(this.user.email===formData.email)&&(this.user.contactinfo===formData.contactinfo)&&(formData.password==="")){
      this.edit = !this.edit;
      return;
    }
    else if(formData.password.length<7 && formData.password.length>0){
      this.toastrService.error(
        `Password is too short`
      )
      return;
    }
    else if (!(/^\S+@\S+\.\S+$/.test(formData.email))) {
      this.toastrService.error(
        `Email must be valid`
      )
      return;
    }

    const userEdit :IUserRegister = {
      Fullname: formData.Fullname,
      email: formData.email,
      contactinfo: formData.contactinfo,
      password: formData.password,
      confirmPassword: formData.password,
    };
    this.itemService.userProfileEdit(userEdit, this.user.id).subscribe(_ => {
    })
    this.userService.Edit(userEdit, this.user.id).subscribe(_ => {
      this.router.navigateByUrl("/login");
    })
  }

  Edit(){
    this.edit = !this.edit;
  }

  Navigate(id: string, type: boolean){
    if(!type){
      this.router.navigateByUrl("lost-items/info/"+id);
      return;
    }
    this.router.navigateByUrl("found-items/info/"+id);
  }

  reqApprove(item: Item){
    this.itemService.Approve(item).subscribe(_ => {
      this.ngOnInit();
    });
  }

  reqDeny(item: Item){
    this.itemService.Deny(item).subscribe(_ => {
      this.ngOnInit();
    });
  }

  reqChange(item: Item){
    var result = confirm("Want to Change Requester to Owner/Finder?");
    if (result) {
      this.itemService.Change(item).subscribe(_ => {
      this.ngOnInit();
    });
    }
  }
}
