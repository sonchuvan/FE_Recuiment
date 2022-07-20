import {
  Component,
  DoCheck,
  OnInit,
} from "@angular/core";
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
export class AuthComponent implements OnInit, DoCheck {
  formLogin: FormGroup;
  isSubmitted = false;
  roles: string[] = [];
  isLoggedIn = false;
  disableClick = "disableClick";

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
  ngDoCheck(): void {
    if (this.formLogin.valid) {
      this.disableClick = "";
    } else {
      this.disableClick = "disableClick";
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
        Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,16}$')
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
          if (data.status == "NOT_FOUND") {
            this.message = "Không tìm thấy tài khoản";
          }
          if (data.status == "UNAUTHORIZED") {
            this.message = "Tài khoản chưa được xác thực";
          }
          this.isLoggedIn = true;
          this.tokenService.saveToken(data.token);
          this.tokenService.saveUser(jwt_decode(data.token));
          if (localStorage.getItem("auth-user") != null) {
            const userinfo = JSON.parse(localStorage.getItem("auth-user"));
            const role = userinfo.auth;
            if (role === "ROLE_ADMIN" || role === "ROLE_JE") {
              this.router.navigate(["/home/"]);
            } else {
              this.router.navigate(["/"]);
            }
          }
        },
        (error) => {
          console.log(error);
          if (error.status == "400") {
            this.message = "Tài khoản hoặc mật khẩu sai.";
          }
          if (error.status == "401") {
            this.message = "Tài khoản hoặc mật khẩu sai.";
          }
        }
      );
    }
  }
}
