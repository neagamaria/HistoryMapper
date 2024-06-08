import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{

  // currently logged-in user
  currentUser: any;
  // selected action
  selectedAction: string = '';
  // form for editing data
  editForm: FormGroup;
  constructor(private userService: UserService, private router: Router, private fb: FormBuilder) {
     this.editForm = this.fb.group({
      newEmail: ['', [Validators.email]],
      newFirstName: [''],
      newLastName: [''],
      newPassword: ['', [Validators.min(6)]]
    });
  }

  async ngOnInit() {
    let username = this.userService.getCurrentUsername();
    if(username === null) {
      this.router.navigate(['/login']).then();
    }
    else {
      this.currentUser = await this.userService.callGetUserAPI(username);

      console.log(this.currentUser);
    }
  }

  // select a desired action
  selectAction(value: string) {
    this.selectedAction = value;
  }

  logOut() {
    this.userService.logOut();
    this.router.navigate(['/']).then();
  }

  // edit the current profile with form data
  async editProfile(form: any) {
    // get values from form or keep the old ones
    let newEmail = (this.editForm.get('newEmail')?.value !== "" ? this.editForm.get('newEmail')?.value : this.currentUser.user.email);
    let newFirstName = (this.editForm.get('newFirstName')?.value !== "" ? this.editForm.get('newFirstName')?.value : this.currentUser.user.first_name);
    let newLastName = (this.editForm.get('newLastName')?.value !== "" ? this.editForm.get('newLastName')?.value : this.currentUser.user.last_name);
    let newPassword = (this.editForm.get('newPassword')?.value !== "" ? this.editForm.get('newPassword')?.value : this.currentUser.user.password);

    // new profile data
    let newData = {
      email: newEmail,
      first_name: newFirstName,
      last_name: newLastName,
      password: newPassword,
    }

    await this.userService.callEditAPI(newData, this.currentUser.user.username).then((response: any) => {
      if(response.status != 200) {
        alert(response.exception);
      }
      else {
        alert("Profile edited successfully");
      }
    });

    this.router.navigate(['/profile']).then();
  }

  // delete the current profile
  async deleteProfile() {
    this.userService.callDeleteAPI(this.currentUser.user.username).then((response: any) => {
      if(response.status != 204) {
        alert(response.exception);
      }
      else {
        alert("Profile deleted successfully");
      }
    });

    // remove user from local history
    this.userService.logOut();
    // go to main page
    this.router.navigate(['/']).then();

  }
}
