import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ItemsService } from 'src/app/services/items.service';
import { UserService } from 'src/app/services/user.service';
import { IItem } from 'src/app/shared/interfaces/IItem';
import { ISensor } from 'src/app/shared/interfaces/ISensor';
import { User } from 'src/app/shared/models/User';
import { ToastrService } from 'ngx-toastr';


class ImageSnippet {
  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'app-post-found-page',
  templateUrl: './post-found-page.component.html',
  styleUrls: ['./post-found-page.component.css']
})
export class PostFoundPageComponent implements OnInit {
  selectedFile!: ImageSnippet;

  user!: User;
  itemForm!: FormGroup;
  isSubmitted = false;
  returnUrl = 'found-items';
  img!: File;
  imgName!: string;


  constructor(private userService: UserService, private itemService: ItemsService, private formBuilder: FormBuilder, private router: Router,
    private toastrService: ToastrService,) {
    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });
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

  get form() {
    return this.itemForm.controls;
  }

  submit() {
    this.itemService.checkVault().subscribe(
      (items) => {
        // Check if there are existing items
        if (items && items.length > 0) {
          // Display a message or take appropriate actions to inform the user
          this.toastrService.error(
            'Cannot submit a new item. There is an existing item in the Vault.'
          )
          return;
        }
  
        // Proceed with the submission logic if there are no existing items
        const led_value: ISensor = {
          sensor_id: "led_1",
          description: "This is our LED",
          location: "Inside the bedroom",
          enable: true,
          type: "toggle",
          value: "",
        };
        this.isSubmitted = true;
        if (this.itemForm.invalid && this.imgName) return;
  
        const fv = this.itemForm.value;
  
        // Generate a random 4-digit PIN
        const randomPin = this.generatePin();
  
        const item: IItem = {
          type: true,
          name: fv.name,
          characteristic: fv.characteristic,
          loc: fv.loc,
          date: fv.date,
          more_info: fv.more_info,
          status: false,
          pin: randomPin,
          poster_id: this.user.id,
          poster_name: this.user.Fullname,
          poster_email: this.user.email,
          poster_contactinfo: this.user.contactinfo,
        };
  
        const reader = new FileReader();
  
        reader.addEventListener('load', (event: any) => {
          this.selectedFile = new ImageSnippet(event.target.result, this.img);
          this.itemService.postItem(item, this.selectedFile.file).subscribe(_ => {
            this.router.navigateByUrl(this.returnUrl);
          });
        });
        reader.readAsDataURL(this.img);

        this.userService.LedEdit(led_value).subscribe(
          sensors => {
            // Handle success
            console.log('Vault opened.', sensors);
          },
          error => {
            // Handle error
            console.error('Please try again!', error);
          }
        );
      },
      (error) => {
        // Handle error from checkVault
        console.error('Error checking vault:', error);
      }
    );
  }

  // Function to generate a random 4-digit PIN
  generatePin(): number {
    return Math.floor(1000 + Math.random() * 9000); // Generating a 4-digit random number
  }


  processFile(imageInput: any) {
    this.img = imageInput.files[0];
    this.imgName = this.img.name;
  }

}