import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url: string ='http://127.0.0.1:8000/api/authentication/';
  url1: string = 'http://127.0.0.1:8000/api/user/'

  private currentUser: any;

  constructor(private http: HttpClient) {}

  // call the login API
  public async callLoginAPI(user: any) {
    this.currentUser = await firstValueFrom(this.http.put<any>(this.url, user));

    return this.currentUser;
  }

  // call the register API
  public async callRegisterAPI(user: any) {

    return await firstValueFrom(this.http.post<any>(this.url, user));
  }


  // call the API that gets a user by username
  public async callGetUserAPI(username: string) {

    return await firstValueFrom(this.http.get<any>(this.url1 + username));
  }


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
