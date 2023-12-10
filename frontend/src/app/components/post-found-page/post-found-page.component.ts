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

  //timer function data
  displayTime: string = '00:00';
  isTimerRunning: boolean = false;
  timerInterval: any;
  totalSeconds: number = 10;
  //end of timer function data


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
    this.itemService.getFalseVal().subscribe(
      (items) => {
        if (items && items.length > 0) {
          this.toastrService.error(
            'Cannot submit a new item. There is an existing item in the Vault.'
          )
        } else {
          this.itemService.checkVault().subscribe(
            (getItems) => {
              // Check if there are existing getItems
              if ((getItems && getItems.length >= 0)) {
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
                  item_type: "found",
                  item_claim: " ",
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
                    this.startTimer();
                    // Handle success
                    console.log('Vault opened.', sensors);
                  },
                  error => {
                    // Handle error
                    console.error('Please try again!', error);
                  }
                );

              }


            },

          )
        }
      }
    )
  }

  startTimer() {
    if (!this.isTimerRunning) {
      this.isTimerRunning = true;
      this.timerInterval = setInterval(() => {
        this.totalSeconds--;
        console.log(this.totalSeconds);
        if (this.totalSeconds <= 0) {
          this.stopTimer();
        }
      }, 1000);
    }
  }

  stopTimer() {
    if (this.isTimerRunning) {
      this.isTimerRunning = false;
      this.updateSensorValue();
      clearInterval(this.timerInterval);
    }
  }

  //function that counts then updates tha value of the sensor
  updateSensorValue() {
    const led_value: ISensor = {
      sensor_id: "led_1",
      description: "This is our LED",
      location: "Inside the bedroom",
      enable: true,
      type: "toggle",
      value: "",
    };

    this.userService.OffLed(led_value).subscribe()
    console.log("TIMES up!");

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