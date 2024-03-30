import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUser: any = null;
  constructor() {}

  // set the user that is logged in
  setCurrentUser(user: any): void {
    localStorage.setItem("user", user.user.username)
  }

  //get the username of the current logged-in user, if exists
  getCurrentUsername(): any {
    const username = localStorage.getItem("user")

    if(username === "undefined")
      return null;

    return username;
  }

  // log out user
  logOut(): any {
    localStorage.removeItem("user");
  }
}
