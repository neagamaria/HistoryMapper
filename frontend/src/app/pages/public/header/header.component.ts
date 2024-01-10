import { Component } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  username: any = null;
  constructor(private userService: UserService, private router: Router) {
  }

  //redirect to login page if user is not logged in
  goToLogin():void {
    if(this.username == null)
     this.router.navigate(['/login']).then();
  }
  // set name of the logged-in user if existent
  getUserName() : any {
    console.log(this.userService.getCurrentUsername());
    this.username = this.userService.getCurrentUsername();
    return this.userService.getCurrentUsername();
  }

  // log out from account
  logoutUser(): void {
    this.userService.logOut();
     this.router.navigate(['/']).then();
  }
}
