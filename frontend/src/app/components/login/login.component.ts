import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!:FormGroup;
  isSubmitted = false;
  returnUrl = '/';

  constructor(private formBuilder:FormBuilder, private userService:UserService, private router:Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

  }
    //loginforms.controls.email
    //form.email

  get form()
  {
    return this.loginForm.controls;
  }

  submit(){
    this.isSubmitted = true;
    if(this.loginForm.invalid) return;

    this.userService.login({
      email: this.form.email.value,
      password: this.form.password.value
    }).subscribe(() => {
      this.router.navigateByUrl(this.returnUrl);
    });
  }
}
