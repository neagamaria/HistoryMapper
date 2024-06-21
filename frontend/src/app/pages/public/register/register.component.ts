import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AbstractControl, Form, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  url: string = 'http://127.0.0.1:8000/api/registration/';

  form : FormGroup;

  registerData: any[] = [];

  constructor(private router: Router, private fb: FormBuilder, private http: HttpClient, private userService: UserService) {
    // get values from form
    this.form = this.fb.group({
      username: ['',
        [Validators.pattern('[a-zA-Z0-9_]*'), Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      first_name: ['', [Validators.pattern('[a-zA-Z0-9_]*'), Validators.required]],
      last_name: ['', [Validators.pattern('[a-zA-Z0-9_]*'), Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    },
      {
        validators: [this.passwordStrengthValidator()]
    });
  }


  // check if password contains the username for security
  passwordStrengthValidator(): ValidatorFn {
       return (form: AbstractControl): ValidationErrors | null => {
            const user: string = form.get('username')?.value;
            const pass: string = form.get('password')?.value;

            if(user && pass && pass.includes(user)) {
              return {weakPassword: true}
            }

            return null;
       }
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
  async register() {
    const userInfo = this.form.value;

    await this.userService.callRegisterAPI(userInfo).then((response) => {
      if (!response.token) {
        alert('Invalid user');
      } else {
        this.registerData = response.data;
        alert('Successful registration');
        this.router.navigate(['/login']).then();
      }
    });
  }
}
