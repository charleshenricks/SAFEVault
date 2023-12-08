import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { IItem } from '../shared/interfaces/IItem';
import { Item } from '../shared/models/Item';
import { APPROVE_URL, CHANGE_URL, CLAIM_ITEM_URL, DELETE_ALL_ITEM, DELETE_ITEM, DENY_URL, EDIT_INFO_ITEM, EDIT_INFO_ITEM1, GET_ALL_POSTS, GET_ALL_REQUESTS, GET_FOUND_ITEM_SEARCH_URL, GET_FOUND_ITEM_URL, GET_INFO_ITEM, GET_LOST_ITEM_SEARCH_URL, GET_LOST_ITEM_URL, GET_USER_POSTS, GET_USER_REQUESTS, ITEM_PROFILE_UPDATE, POST_ITEM_URL } from '../shared/constants/urls';
import { ToastrService } from 'ngx-toastr';
import { IItem2 } from '../shared/interfaces/IItem2';
import { User } from '../shared/models/User';
import { IUserRegister } from '../shared/interfaces/IUserRegister';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  constructor(private http:HttpClient, private toastrService: ToastrService) { }

  postItem(item :IItem, image:File): Observable<Item>{
    const formData = new FormData();

    formData.append('image', image);
    formData.append('poster_id', item.poster_id);
    formData.append('poster_name', item.poster_name);
    formData.append('poster_email', item.poster_email);
    formData.append('name', item.name);
    formData.append('poster_contactinfo', item.poster_contactinfo);
    formData.append('type', item.type.toString());
    formData.append('characteristic', item.characteristic);
    formData.append('loc', item.loc);
    formData.append('date', item.date);
    formData.append('status', item.status.toString());
    formData.append('more_info', item.more_info);

    return this.http.post<Item>(POST_ITEM_URL, formData).pipe(
      tap({
        next: (item) => {
          if(item.type){
            this.toastrService.success(
              `Found Item: ${item.name}`,
              'Posted Successfully'
            )
          }
          else{
            this.toastrService.success(
              `Lost Item: ${item.name}`,
              'Posted Successfully'
            )
          }
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Post Failed');
        }

      })
    );;
  }

  editPost(ITEM:IItem2, id:string, image:any): Observable<Item>{
    const formData = new FormData();
    formData.append('image', image);
    formData.append('characteristic', ITEM.characteristic);
    formData.append('name', ITEM.name);
    formData.append('loc', ITEM.loc);
    formData.append('date', ITEM.date);
    formData.append('more_info', ITEM.more_info);
    return this.http.patch<Item>(EDIT_INFO_ITEM + id, formData).pipe(
      tap({
        next: (item) => {
            this.toastrService.success(
              'Edit Successful'
            )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Command Unsuccessful');
        }
      })
    );;
  }

  editPost1(ITEM:IItem2, id:string): Observable<Item>{
    return this.http.patch<Item>(EDIT_INFO_ITEM1 + id, ITEM).pipe(
      tap({
        next: (item) => {
            this.toastrService.success(
              'Edit Successful'
            )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Command Unsuccessful');
        }
      })
    );;
  }

  getLostItems(): Observable<Item[]>{
    return this.http.get<Item[]>(GET_LOST_ITEM_URL);
  }
  getFoundItems(): Observable<Item[]>{
    return this.http.get<Item[]>(GET_FOUND_ITEM_URL);
  }

  getFoundItemsBySearchTerm(searchTerm: string) {
    return this.http.get<Item[]>(GET_FOUND_ITEM_SEARCH_URL + searchTerm);
  }

  getLostItemsBySearchTerm(searchTerm: string) {
    return this.http.get<Item[]>(GET_LOST_ITEM_SEARCH_URL + searchTerm);
  }

  getItemByID(id:string): Observable<Item>{
    return this.http.get<Item>(GET_INFO_ITEM + id);
  }

  getUserPosts(id:string): Observable<Item[]>{
    return this.http.get<Item[]>(GET_USER_POSTS + id);
  }

  getAllPosts(): Observable<Item[]>{
    return this.http.get<Item[]>(GET_ALL_POSTS);
  }

  getUserRequests(id:string): Observable<Item[]>{
    return this.http.get<Item[]>(GET_USER_REQUESTS + id);
  }

  getAllRequests(): Observable<Item[]>{
    return this.http.get<Item[]>(GET_ALL_REQUESTS);
  }

  claimPost(itemID:string, user:User): Observable<Item>{
    return this.http.patch<Item>(CLAIM_ITEM_URL+itemID, user).pipe(
      tap({
        next: (item) => {
            this.toastrService.success(
              'Poster Notified'
            )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Command Unsuccessful');
        }
      })
    );;
  }

  Approve(item:Item): Observable<Item>{
    return this.http.patch<Item>(APPROVE_URL, item).pipe(
      tap({
        next: (item) => {
          this.toastrService.success(
            `Status Change`,
            'Request Approved'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Command Unsuccessful');
        }
      })
    );;
  }

  Deny(item:Item): Observable<Item>{
    return this.http.patch<Item>(DENY_URL, item).pipe(
      tap({
        next: (item) => {
          this.toastrService.success(
            `Status Unchanged`,
            'Request Rejected'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Command Unsuccessful');
        }
      })
    );;
  }

  Change(item:Item): Observable<Item>{
    return this.http.patch<Item>(CHANGE_URL, item).pipe(
      tap({
        next: (item) => {
          this.toastrService.success(
            `Status Changed`,
            'Owner/Finder Changed'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Command Unsuccessful');
        }
      })
    );;
  }

  userProfileEdit(userEdit: IUserRegister, id:string): Observable<Item>{
    return this.http.patch<Item>(ITEM_PROFILE_UPDATE+id, userEdit);
  }

  deleteItemByID(id:string){
    return this.http.delete(DELETE_ITEM + id).pipe(
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

  deleteAllItem(){
    return this.http.delete(DELETE_ALL_ITEM).pipe(
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

  checkVault(): Observable<Item[]> {
    return this.http.get<Item[]>(GET_FOUND_ITEM_URL)
  }

}
