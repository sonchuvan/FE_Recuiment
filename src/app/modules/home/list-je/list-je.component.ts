import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Users } from "../../../@core/models/user";
import { SeachUser } from "../../../@core/models/seachUser";
import { UserService } from "../../../@core/services/user.service";
import { Toaster } from "ngx-toast-notifications";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "ngx-list-je",
  templateUrl: "./list-je.component.html",
  styleUrls: ["./list-je.component.scss"],
})
export class ListJeComponent implements OnInit {
  userDetail!: FormGroup;
  seachU: SeachUser = new SeachUser();
  userObj: Users = new Users();
  userList: Users[];
  message = "";
  pageNumber: Number[] = new Array();
  click = false;
  numberUser = 0;
  pageN = 0;
  

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toaster: Toaster
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.seach();
    this.numberUserJe();
  }
  numberUserJe(){
    this.userService.getNumberUserJe().subscribe(
      (data) => {
        this.numberUser = data;
        console.log(this.numberUser);
        this.pageN = Math.floor(this.numberUser/6);
        console.log(this.pageN);
        for(let i=0; i<this.pageN;i++){
            this.pageNumber[i]=i;
        }
        console.log(this.pageNumber);
        
      })
  }
  initForm() {
    this.userDetail = this.formBuilder.group({
      id: new FormControl("id", [Validators.required]),
      name: new FormControl("", [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
      ]),
      email: new FormControl("", [Validators.required, Validators.email]),
      phoneNumber: new FormControl("", [
        Validators.required,
        Validators.pattern("(84|0[3|5|7|8|9])+([0-9]{8})\\b"),
      ]),
      userName: new FormControl("", [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
      ]),
      password: new FormControl("", [
        Validators.required,
        Validators.pattern(
          "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,16}$"
        ),
      ]),
      confirmPassword: new FormControl("", [
        Validators.required,
        Validators.pattern(
          "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,16}$"
        ),
      ]),
      pageNumber: new FormControl('1', [Validators.required]),
      pageSize: new FormControl('6', [Validators.required]),
      sortT: new FormControl('ASC', [Validators.required]),
      sortColum: new FormControl('id', [Validators.required]),
    });
  }

  sort(sortColum: string) {
    this.userDetail.value.sortColum = sortColum;
    if (this.click) {
      this.userDetail.value.sortT = 'ASC';
      this.click = false;
    } else {
      this.userDetail.value.sortT = "DESC";
      this.click = true;
    }
    this.seach();
  }

  seach() {
    if (
      this.userDetail.value.sortT == null ||
      this.userDetail.value.sortColum == null
    ) {
      this.userDetail.value.sortT = "DESC";
      this.userDetail.value.sortColum = "id";
    }
    console.log(this.userDetail.value);
    
    this.userService.getAllUserJeForm(this.userDetail.value).subscribe(
      (data) => {
        this.userList = data;
      },
      (err) => {
        console.log("error while fetching data.");
      }
    );
  }
  toFormAddUser() {
    console.log(this.userDetail);
  }

  setPage(n: number) {
    (this.userDetail.value.pageNumber = n), this.seach();
  }

  editUser(user: Users) {
    this.userDetail.controls["id"].setValue(user.id);
    this.userDetail.controls["name"].setValue(user.name);
    this.userDetail.controls["email"].setValue(user.email);
    this.userDetail.controls["phoneNumber"].setValue(user.phoneNumber);
    this.userDetail.controls["userName"].setValue(user.userName);
  }

  addUser() {
    this.userObj.name = this.userDetail.value.name;
    this.userObj.email = this.userDetail.value.email;
    this.userObj.phoneNumber = this.userDetail.value.phoneNumber;
    this.userObj.userName = this.userDetail.value.userName;
    this.userObj.password = this.userDetail.value.password;
    console.log(this.userObj);

    this.userService.addUser(this.userObj).subscribe(
      (res) => {
        console.log(res);
        if (
          res == null ||
          res.status === "NO_CONTENT" ||
          res.status === "NOT_FOUND" ||
          res.status === "500"
        ) {
          this.showToaster("Tài khoản hoặc email đã sử dụng", "danger");
        }
        if (res.status === "OK") {
          this.showToaster("Đăng ký tài khoản thành công", "success");
          this.userDetail.reset();
        }
      },
      (err) => {
        console.log(err);
        this.showToaster("Tài khoản hoặc email đã sử dụng", "danger");
      }
    );
  }

  updateUser() {
    this.userObj.id = this.userDetail.value.id;
    this.userObj.name = this.userDetail.value.name;
    this.userObj.password = this.userDetail.value.password;
    this.userObj.email = this.userDetail.value.email;
    this.userObj.phoneNumber = this.userDetail.value.phoneNumber;
    this.userObj.userName = this.userDetail.value.userName;
    this.userService.updateUser(this.userDetail.value).subscribe(
      (res) => {
        this.showToaster("Update thành công", "success");
        this.userDetail.reset();
      },
      (error) => {
        console.log(error);
        if (error.status === "500") {
          this.showToaster("Tài khoản hoặc số email đã sử dụng.", "danger");
        }
      }
    );
  }

  onChangeActive(id: number) {
    this.userObj.id = id;
    this.userService.deactivateUser(this.userObj).subscribe(
      (data) => {
        this.seach();
        if (data.activate) {
          this.showToaster("Deactivate User Successfull.", "success");
        } else {
          this.showToaster("Successfull.", "success");
        }
      },
      (error: HttpErrorResponse) => {
        this.showToaster(error.message, "danger");
      }
    );
  }

  showToaster(message: string, typea: any) {
    const type = typea;
    this.toaster.open({
      text: message,
      caption: "Status",
      type,
      duration: 3000,
    });
  }
}
