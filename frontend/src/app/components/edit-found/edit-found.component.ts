import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsService } from 'src/app/services/items.service';
import { UserService } from 'src/app/services/user.service';
import { IItem2 } from 'src/app/shared/interfaces/IItem2';
import { Item } from 'src/app/shared/models/Item';
import { User } from 'src/app/shared/models/User';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-edit-found',
  templateUrl: './edit-found.component.html',
  styleUrls: ['./edit-found.component.css']
})
export class EditFoundComponent implements OnInit {
  selectedFile!: ImageSnippet;
  user!:User;
  item = {} as Item;
  itemForm!:FormGroup;
  isSubmitted = false;
  returnUrl = 'found-items/info/';
  img!: File;
  imgName!: string;

  constructor(userService:UserService, private itemService:ItemsService,
    private formBuilder:FormBuilder , private router:Router, activatedRoute:ActivatedRoute) {
    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });
    activatedRoute.params.subscribe((params) => {
      this.itemService.getItemByID(params.itemID).subscribe(serverItem => {
      this.item = serverItem;
    });
  })
  }
  ngOnInit(): void {
    this.itemForm = this.formBuilder.group({
      name: ['', Validators.required],
      characteristic: ['', Validators.required],
      loc: ['', Validators.required],
      date: ['', Validators.required],
      more_info: ['', Validators.required],
    });
  }

  get form()
  {
    return this.itemForm.controls;
  }

  submit(){
    this.returnUrl = this.returnUrl + this.item.id;

    const fv= this.itemForm.value;

      const ITEM :IItem2 = {
        name: fv.name,
        characteristic: fv.characteristic,
        loc: fv.loc,
        date: fv.date,
        more_info: fv.more_info,
      };

    if(this.imgName) {
      const reader = new FileReader();
      reader.addEventListener('load', (event: any) => {
        this.selectedFile = new ImageSnippet(event.target.result, this.img);
        this.itemService.editPost(ITEM, this.item.id ,this.selectedFile.file).subscribe(_ => {
          this.router.navigateByUrl(this.returnUrl);
        })
      });
      reader.readAsDataURL(this.img);
    }
    else{
      this.itemService.editPost1(ITEM, this.item.id).subscribe(_ => {
        this.router.navigateByUrl(this.returnUrl);
      })
    }

  }

  processFile(imageInput: any) {
    this.img = imageInput.files[0];
    this.imgName = this.img.name;
  }

}

