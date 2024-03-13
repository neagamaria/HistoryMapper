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

  url: string = 'http://127.0.0.1:8000/api/login/';
  form: FormGroup;
  loginData: any = null;

   constructor(private userService: UserService, private router: Router, private fb: FormBuilder, private http: HttpClient) {
    // get values from form
    this.form = this.fb.group ({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.min(6)]],
    })
  }

  // navigate to register page
   goToRegister() {
    this.router.navigate(['/register']).then();
  }

  // call login API
  login(): void {
     const user = this.form.value;

     this.http.post(this.url, user).subscribe ((response: any) => {
       this.loginData = response;

       console.log("Log in data: ", this.loginData);

       if(this.loginData.token != null) {
         // save the logged-in user
         this.userService.setCurrentUser(this.loginData);
         // go to main page
         this.router.navigate(['/']).then();
       }
     });
  }
}
