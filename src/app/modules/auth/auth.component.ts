import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../@core/services/auth.service";
import { TokenService } from "../../@core/services/token.service";
import jwt_decode from "jwt-decode";


@Component({
  selector: "ngx-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
})
export class AuthComponent implements OnInit {
  formLogin: FormGroup;
  isSubmitted = false;
  roles: string[] = [];
  isLoggedIn = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.tokenService.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenService.getUser().roles;
    }
  }
  message = "";
  initForm() {
    this.formLogin = this.fb.group({
      userName: new FormControl("", [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
      ]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(18),
      ]),
    });
  }

  get f() {
    return this.formLogin.controls;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.formLogin.valid) {
      this.authService.login(this.formLogin.value).subscribe(
        (data) => {
          this.isLoggedIn = true;
          // save token local
          this.tokenService.saveToken(data.token);
          this.tokenService.saveUser(jwt_decode(data.token));

          if (localStorage.getItem("auth-user") != null) {
            const userinfo = JSON.parse(localStorage.getItem("auth-user"));
            // lấy ra auth để router
            const role = userinfo.auth;
            console.log('login wwith '+role);
            if(role === "ROLE_ADMIN" || role === "ROLE_JE"){
              // router admin
              this.router.navigate(["/home/"]);
            } else {
              // router public
              this.router.navigate(["/listje"]);
            }
          }
        },
        (error) => {
          if (error.status == "400") {
            this.message = "Tài khoản hoặc mật khẩu sai.";
          }
          if (error.status == "401") {
            this.message = "Tài khoản chưa kích hoạt.";
          }
        }
      );
    }
  }
}
