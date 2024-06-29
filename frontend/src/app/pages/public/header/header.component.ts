import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  // current username
  username: any = null;


  constructor(private userService: UserService, private router: Router, private cdf: ChangeDetectorRef) {
  }

  async ngOnInit() {

     this.username = this.userService.getCurrentUsername();
     this.cdf.detectChanges();
     this.cdf.detectChanges();
  }

  //redirect to login page if user is not logged in
  goToLogin():void {
    if(this.username == null)
     this.router.navigate(['/login']).then();
    else
      this.router.navigate(['/profile']).then();
  }

  //go to home page
  goToHomePage():void {
    this.router.navigate(['/']).then();
  }

  goToMap(): void {
    this.router.navigate(['/explore-maps']).then();
  }

   goToHistoricalPeriods(): void {
    this.router.navigate(['/historical-periods']).then();
  }

  goToQuizzes() {
    this.router.navigate(['/quizzes']).then();
  }

  goToAdminPage(): void {
      this.router.navigate(['/admin-page']).then();
  }


  // set name of the logged-in user if existent
  getUserName() {
    this.username = this.userService.getCurrentUsername();
    return this.username;
  }


  // check if current user is admin
  checkIfAdmin() {
    return this.userService.checkIfAdmin();
  }


  // log out from account
  logoutUser(): void {
    this.userService.logOut();
     this.router.navigate(['/']).then();
  }
}
