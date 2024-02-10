import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {Form, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  url: string = 'http://127.0.0.1:8000/api/registration/';

  form : FormGroup;

  registerData: any[] = [];

  constructor(private router: Router, private fb: FormBuilder, private http: HttpClient) {
    // get values from form
    this.form = this.fb.group ({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.min(6)]],
      email: ['', [Validators.required, Validators.email]]
    })
  }

  // navigate to login page
  goToLogin() {
    this.router.navigate(['/login']).then();
  }

  //navigate to main page
  goToMainPage() {
    this.router.navigate(['/']).then();
  }

  // call register api
  register(): void {
    const userInfo = this.form.value;
    console.log(userInfo);

     this.http.post(this.url, userInfo).subscribe((response: any): any => {
        this.registerData = response.data;

        if(response.token != null) {
           this.router.navigate(['/']).then();
        }
      }
    );
  }
}
