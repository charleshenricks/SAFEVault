import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  admin!: User;
  constructor(private userService:UserService) { }

    ngOnInit(): void {
      this.userService.getAdmin().subscribe((admin) => {
        this.admin = admin;
      });
  }

}
