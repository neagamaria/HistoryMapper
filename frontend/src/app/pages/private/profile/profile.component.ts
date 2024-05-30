import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{

  // currently logged-in user
  currentUser: any;
  constructor(private userService: UserService, private router: Router) {}

  async ngOnInit() {
    let username = this.userService.getCurrentUsername();
    if(username === null) {
      this.router.navigate(['/login']).then();
    }
    else {
      this.currentUser = await this.userService.callGetUserAPI(username);
    }
  }
}
