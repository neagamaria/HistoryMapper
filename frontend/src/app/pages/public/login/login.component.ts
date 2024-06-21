import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  form: FormGroup;

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder, private http: HttpClient) {
    // get values from form
    this.form = this.fb.group({
      username: ['', [Validators.pattern('[a-zA-Z0-9_]*'), Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  // navigate to register page
  goToRegister() {
    this.router.navigate(['/register']).then();
  }

  // call login API
  async login() {
    const user = this.form.value;

    await this.userService.callLoginAPI(user).then((response) => {
      console.log(response);
      if (!response.token || response == 404) {
        alert('Invalid user or password');
      } else {
        this.userService.setCurrentUser(response);
        this.router.navigate(['/']).then();
      }
    });
  }
}
