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
    try {
      this.currentUser = await firstValueFrom(this.http.put<any>(this.url, user));

      return this.currentUser;
    }
    catch(e) {
      return 404;
    }
  }


  // call the register API
  public async callRegisterAPI(user: any) {

    return await firstValueFrom(this.http.post<any>(this.url, user));
  }

  // call the API endpoint for editing a user
  public async callEditAPI(newData: any, username: string) {
    return await firstValueFrom(this.http.put(this.url1 + username, newData));
  }


  // call the API endpoint for deleting a user
  public async callDeleteAPI(username: string) {
    return await firstValueFrom(this.http.delete(this.url1 + username));
  }


  // call the API that gets a user by username
  public async callGetUserAPI(username: string) {
    let response =  await firstValueFrom(this.http.get<any>(this.url1 + username));

    if(response.user)
      localStorage.setItem("admin", response.user.is_superuser);

    return response;
  }


  // set the user that is logged in
  setCurrentUser(user: any): void {
    localStorage.setItem("user", user.user.username);
  }


  //get the username of the current logged-in user, if exists
  getCurrentUsername(): any {
    const username = localStorage.getItem("user");

    if(username === "undefined")
      return null;

    return username;
  }

  // check if current user is admin
  checkIfAdmin() {
    return localStorage.getItem("admin");
  }


  // log out user
  logOut(): any {
    localStorage.removeItem("user");
    localStorage.setItem("admin", '');
  }
}
