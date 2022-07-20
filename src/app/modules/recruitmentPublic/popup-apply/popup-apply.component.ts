import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { JobRegisterPublic } from "../../../@core/models/jobRegisterPublic";
import { RecruitmentService } from "../../../@core/services/recuitment-public.service";
import { Toaster } from "ngx-toast-notifications";
import { HttpClient } from "@angular/common/http";
@Component({
  selector: "ngx-popup-apply",
  templateUrl: "./popup-apply.component.html",
  styleUrls: ["./popup-apply.component.scss"],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class PopupApply implements OnInit {
  [x: string]: any;
  profileP: FormGroup;
  jobId: any;
  userName: string;
  role: string;
  jobRegPObj: JobRegisterPublic = new JobRegisterPublic();
  filetoUpload: any;
  checkloggin = false;
  nameFIle = "";

  constructor(
    private recruitmentService: RecruitmentService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private toaster: Toaster,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      this.jobId = params["id"];
    });
    this.initForm();
  }
  initForm() {
    this.profileP = this.formBuilder.group({
      pdf: new FormControl("1", [Validators.required]),
    });
  }
  registerJob() {
    const userinfo = JSON.parse(localStorage.getItem("auth-user"));
    if (!userinfo) {
      this.checkloggin = false;
    } else {
      this.role = userinfo.auth;
      this.userName = userinfo.sub;
      if (
        this.role === "ROLE_ADMIN" ||
        this.role === "ROLE_JE" ||
        this.role === "ROLE_USER"
      ) {
        this.checkloggin = true;
        this.jobRegPObj.userName = this.userName;
      }
    }
    // eslint-disable-next-line eqeqeq
    if (this.jobId != null && this.checkloggin == true) {
      this.jobRegPObj.jobId = this.jobId;
      this.jobRegPObj.pdf = this.nameFIle; 
      this.uploadFilePdf(); 
      this.recruitmentService.registerJob(this.jobRegPObj).subscribe(
        (data) => {
          console.log(data);
          // eslint-disable-next-line eqeqeq
          if (data.statusCode == "OK") {
            this.showToaster(
              "Apple thành công, chúng tôi sẽ liên hệ sớm nhất.",
              "success"
            );
            this.profileP.reset();
          } else {
            this.showToaster(
              "Apple không thành công thành công, chúng tôi sẽ liên hệ sớm nhất.",
              "danger"
            );
          }
        },
        (error) => {
          console.log(error);
          // eslint-disable-next-line eqeqeq
          if (error.status == "500") {
            this.showToaster("Mỗi một job chỉ được apply 1 lần.", "danger");
          }
        }
      );
    } else {
      this.showToaster("Đăng nhập trước khi apply.", "danger");
    }
  }
  onChange(file: File) {
    this.fileToUpload = file[0];
    console.log(this.fileToUpload);
    this.nameFIle = this.fileToUpload.name;
    console.log(this.nameFIle);
  }

  uploadFilePdf() {
    const formDataUpLoad = new FormData();
    formDataUpLoad.append("file", this.fileToUpload);
    this.httpClient
      .post("http://localhost:9090/api/public/uploadFile", formDataUpLoad, {
        observe: "response",
      })
      .subscribe((response) => {
      });
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
