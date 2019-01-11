import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'wetr-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  constructor(private api : ApiService, private router: Router, private formBuilder: FormBuilder) { }

  loggingIn : boolean = false
  form: FormGroup;
  loginFailed = false;

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
  }

  async onSubmit () {
    this.loggingIn = true;
    let response = await this.api.login({Email: this.form.get("email").value, Password: this.form.get("password").value});

    if(response === true){
      this.loginFailed = false;
      this.loggingIn = false;
      this.router.navigate(['/'])
    }else if(response === false){
      this.loginFailed = true;
    }
    this.loggingIn = false;

  }

}
