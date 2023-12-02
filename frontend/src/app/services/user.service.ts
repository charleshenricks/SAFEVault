import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { DELETE_ALL_USERS, DELETE_USERS_URL, GET_ADMIN_URL, GET_USERS_URL, USER_EDIT_URL, USER_LOGIN_URL, USER_REGISTER_URL, LED_EDIT  } from '../shared/constants/urls';
import { IUserLogin } from '../shared/interfaces/IUserLogin';
import { IUserRegister } from '../shared/interfaces/IUserRegister';
import { User } from '../shared/models/User';
import { ISensor } from '../shared/interfaces/ISensor';
import { Sensors } from './../shared/models/Sensors';


const USER_KEY = 'User';
const SENSOR_KEY = 'Sensors';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage());
  public userObservable: Observable<User>;
  

  constructor(private http:HttpClient, private toastrService: ToastrService, private router: Router) {
    this.userObservable = this.userSubject.asObservable();
  }


  public get currentUser():User{
    return this.userSubject.value;
  }

  login(userLogin: IUserLogin): Observable<User>{
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(
            `Welcome ${user.Fullname}!`,
            'Login Successfully'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Login Failed');
        }

      })
    );
  }

  register(userRegister:IUserRegister): Observable<User>{
    return this.http.post<User>(USER_REGISTER_URL, userRegister).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(
            `Welcome ${user.Fullname}!`,
            'Registered Successfully'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Register Failed');
        }

      })
    );
  }

  Edit(userEdit:IUserRegister, id:string): Observable<User>{
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    return this.http.patch<User>(USER_EDIT_URL+id, userEdit).pipe(
      tap({
        next: (user) => {
          this.toastrService.success(
            `Edit Successful`,
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Edit Failed');
        }

      })
    );
  }

  adminEdit(userEdit:IUserRegister, id:string): Observable<User>{
    return this.http.patch<User>(USER_EDIT_URL+id, userEdit).pipe(
      tap({
        next: (user) => {
          this.toastrService.success(
            `Edit Successful`,
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Edit Failed');
        }

      })
    );
  }

  deleteUserByID(id:string){
    return this.http.delete(DELETE_USERS_URL + id).pipe(
      tap({
        next: (id) => {
            this.toastrService.success(
              'Deleted Successfully'
            )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Deletion Failed');
        }
      })
    );;
  }

  getAdmin(): Observable<User>{
    return this.http.get<User>(GET_ADMIN_URL);
  }

  getUsers(): Observable<User[]>{
    return this.http.get<User[]>(GET_USERS_URL);
  }

  deleteAllUsers(){
    return this.http.delete(DELETE_ALL_USERS).pipe(
      tap({
        next: (id) => {
            this.toastrService.success(
              'All Users Deleted'
            )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Deletion Failed');
        }
      })
    );;
  }


  logout(){
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    this.router.navigateByUrl('/');
  }

  setUserToLocalStorage(user:User){
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  setSensorToLocalStorage(sensors:Sensors){
    localStorage.setItem(LED_EDIT, JSON.stringify(sensors));
  }

  getSensorFromLocalStorage(sensors:Sensors){
    const sensorJson = localStorage.getItem(SENSOR_KEY);
    if(sensorJson) return JSON.parse(sensorJson) as Sensors;
    return new Sensors();
  }
  
  getUserFromLocalStorage():User{
    const userJson = localStorage.getItem(USER_KEY);
    if(userJson) return JSON.parse(userJson) as User;
    return new User();
  }

  isAuthenticated(): boolean {
    return (localStorage.getItem(USER_KEY) != null);
  }

  LedEdit(sensorUpdate:ISensor): Observable<Sensors>{
    return this.http.post<Sensors>(LED_EDIT, sensorUpdate).pipe(
      tap({
        next: (sensors) => {
          this.setSensorToLocalStorage(sensors);
          this.toastrService.success(
            "Edit Successfully"
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Edit Failed');
        }

      })
    );
  }
}
