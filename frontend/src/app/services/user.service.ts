import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUser: any = null;
  constructor() { }

  // set the user that is logged in
  setCurrentUser(user: any): void {
    this.currentUser = user;
  }

  getCurrentUsername(): any {
    if(this.currentUser == null)
      return null;
    return this.currentUser.user.username;
  }

  // log out user
  logOut(): any {
    this.currentUser = null;
  }
}
