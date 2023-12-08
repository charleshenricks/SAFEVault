import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ItemsService } from 'src/app/services/items.service';
import { UserService } from 'src/app/services/user.service';
import { IItem } from 'src/app/shared/interfaces/IItem';
import { ISensor } from 'src/app/shared/interfaces/ISensor';
import { User } from 'src/app/shared/models/User';

class ImageSnippet {
  constructor(public src: string, public file: File) { }
}


@Component({
  selector: 'app-post-lost-page',
  templateUrl: './post-lost-page.component.html',
  styleUrls: ['./post-lost-page.component.css']
})
export class PostLostPageComponent {
  selectedFile!: ImageSnippet;

  user!: User;
  itemForm!: FormGroup;
  isSubmitted = false;
  returnUrl = 'lost-items';
  img!: File;
  imgName!: string;

  //timer function data
  displayTime: string = '00:00';
  isTimerRunning: boolean = false;
  timerInterval: any;
  totalSeconds: number = 3;
  //end of timer function data


  constructor(private userService: UserService, private itemService: ItemsService, private formBuilder: FormBuilder, private router: Router) {
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

    //this.startTimer();
    const randomPin = this.generatePin();

    const item: IItem = {

      type: false,
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
      })
    });
    reader.readAsDataURL(this.img);
  }

  // startTimer() {
  //   if (!this.isTimerRunning) {
  //     this.isTimerRunning = true;
  //     this.timerInterval = setInterval(() => {
  //       this.totalSeconds--;
  //       console.log(this.totalSeconds);
  //       if (this.totalSeconds <= 0) {
  //         this.stopTimer();
  //       }
  //     }, 1000);
  //   }
  // }

  // stopTimer() {
  //   if (this.isTimerRunning) {
  //     this.isTimerRunning = false;
  //     this.updateSensorValue();
  //     clearInterval(this.timerInterval);
  //   }
  // }

  // //function that counts then updates tha value of the sensor
  // updateSensorValue() {
  //   const led_value: ISensor = {
  //     sensor_id: "led_1",
  //     description: "This is our LED",
  //     location: "Inside the bedroom",
  //     enable: true,
  //     type: "toggle",
  //     value: "",
  //   };

  //   this.userService.OffLed(led_value).subscribe()
  //   console.log("TIMES up!");

  // }

  generatePin(): number {
    return Math.floor(1000 + Math.random() * 9000); // Generating a 4-digit random number
  }

  processFile(imageInput: any) {
    this.img = imageInput.files[0];
    this.imgName = this.img.name;
  }

}
