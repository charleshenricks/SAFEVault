import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ItemsService } from 'src/app/services/items.service';
import { UserService } from 'src/app/services/user.service';
import { IupdateReq } from 'src/app/shared/interfaces/IRequestUpdate';
import { IUserRegister } from 'src/app/shared/interfaces/IUserRegister';
import { Item } from 'src/app/shared/models/Item';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent {

  users!: User[];
  admin!: User;
  posts: Item[] = [];
  requests: Item[] = [];
  itemUrl!:string;
  userForms!: FormGroup[];
  isSubmitted = false;
  Edittoggle!: Boolean[];
  hideUser = true;
  hidePost = true;
  editForm!:FormGroup;
  edit=true;

  constructor(private itemService: ItemsService, private router: Router, private userService:
    UserService, private toastrService: ToastrService) { }

    ngOnInit(): void {
      this.userService.userObservable.subscribe((newUser) => {
        this.admin = newUser;
      });
      this.userService.getUsers().subscribe((USERS) => {
        this.users = USERS;
        this.Edittoggle = new Array(this.users.length).fill(true);
        this.userForms = this.createForms();
      });
      this.editForm = new FormGroup({
        Fullname: new FormControl(this.admin.Fullname),
        email: new FormControl(this.admin.email),
        contactinfo: new FormControl(this.admin.contactinfo),
        password: new FormControl(""),
      });

      this.itemService.getAllPosts().subscribe((userPosts) => {
        this.posts = userPosts;
      });
      this.itemService.getAllRequests().subscribe((userRequests) => {
        this.requests = userRequests;
      });

   // setTimeout(() => { this.ngOnInit() }, 1000 * 100);
  }

  createForms(): FormGroup[] {
    return this.users.map(user => {
      return new FormGroup({
        Fullname: new FormControl(user.Fullname, Validators.required),
        email: new FormControl(user.email, [Validators.required, Validators.email]),
        contactinfo: new FormControl(user.contactinfo, Validators.required),
        password: new FormControl("", [Validators.required, Validators.minLength(6)])
      });
    });
  }

  Save(){
    const formData = this.editForm.value;
    if((this.admin.Fullname===formData.Fullname)&&(this.admin.email===formData.email)&&(this.admin.contactinfo===formData.contactinfo)&&(formData.password==="")){
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
    this.userService.Edit(userEdit, this.admin.id).subscribe(_ => {
      this.router.navigateByUrl("/login");
    })
  }

  onSubmit(form: FormGroup, i:any): void {
    if((this.users[i].Fullname===form.value.Fullname)&&(this.users[i].email===form.value.email)&&(this.users[i].contactinfo===form.value.contactinfo)&&(form.value.password==="")){
      this.Edittoggle[i] = !this.Edittoggle[i];
      return;
    }
    else if(form.value.password.length<7 && form.value.password.length>0){
      this.toastrService.error(
        `Password is too short`
      )
      return;
    }
    else if (!(/^\S+@\S+\.\S+$/.test(form.value.email))) {
      this.toastrService.error(
        `Email must be valid`
      )
      return;
    }
    const userEdit :IUserRegister = {
      Fullname: form.value.Fullname,
      email: form.value.email,
      contactinfo: form.value.contactinfo,
      password: form.value.password,
      confirmPassword: form.value.password,
    };
    this.userService.adminEdit(userEdit, this.users[i].id).subscribe(_ => {
      this.ngOnInit();
    })
  }
  deleteUser(i:any){
      this.userService.deleteUserByID(this.users[i].id).subscribe(_ => {
        this.ngOnInit();
      });
  }
  deleteAllUsers(){
    this.userService.deleteAllUsers().subscribe(_ => {
      this.ngOnInit();
    });
}

  Navigate(id: string, type: boolean){
    if(!type){
      this.router.navigateByUrl("lost-items/info/"+id);
      return;
    }
    this.router.navigateByUrl("found-items/info/"+id);
  }

  reqApprove(item: Item){
    const update: IupdateReq = {
      id: item.id,
      approve: true,
      poster_date: new Date().toLocaleString(),
    }
    this.itemService.Approve(item).subscribe(_ => {
      this.ngOnInit();
    });
  }

  reqDeny(item: Item){
    const update: IupdateReq = {
      id: item.id,
      approve: false,
      poster_date: new Date().toLocaleString(),
    }
    this.itemService.Deny(item).subscribe(_ => {
      this.ngOnInit();
    });
  }

  reqChange(item: Item){
    var result = confirm("Want to Change Owner to Requester?");
    if (result) {
      const update: IupdateReq = {
        id: item.id,
        approve: false,
        poster_date: new Date().toLocaleDateString(),
      }
      this.itemService.Change(item).subscribe(_ => {
      this.ngOnInit();
    });
    }
  }

  postDelete(id:string){
    this.itemService.deleteItemByID(id).subscribe(_ => {
      this.ngOnInit();
    });
  }

  postDeleteAll(){
    this.itemService.deleteAllItem().subscribe(_ => {
      this.ngOnInit();
    });
  }

  Edit(i:any){
    this.Edittoggle[i] = !this.Edittoggle[i];
  }

  EditAdmin(){
    this.edit = !this.edit;
  }

  togglehideUser(){
    this.hideUser = !this.hideUser;
  }

  togglehidePost(){
    this.hidePost = !this.hidePost;
  }

}
