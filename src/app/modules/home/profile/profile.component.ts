import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import {  Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators,FormControl } from "@angular/forms";
import { PrimeNGConfig } from "primeng/api";
import { SessionService } from "../../../@core/services/session.service";
import { User } from "./profile.model";
import { ProfileService } from "./profile.service";
import { formatDate } from '@angular/common';
import { Toaster } from "ngx-toast-notifications";


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
   Authorization:'Bearer '+localStorage.getItem('auth-token'),
  }),
}
@Component({
  selector: "ngx-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  [x: string]: any;
  formProfile: FormGroup;
  user: User;
  @ViewChild("labelImport")
  labelImport: ElementRef;
  userName: any;
  filetoUpload:any;
  dbImage: any;
  filea:File;
  isChange=false;
  currentDate= new Date();
  constructor(
    private sessionService: SessionService,
    private profileService: ProfileService,
    private fb: FormBuilder,
    private primengConfig: PrimeNGConfig,
    private httpClient:HttpClient,
    private toaster:Toaster
  ) { }


  ngOnInit(): void {
    
    // this.getByUserName();
    this.getByUserName();
    this.initForm();
  }

  initForm() {
    this.formProfile = this.fb.group({
      id: [""],
      file:[""],
      avatarName:[""],
      name: ["", Validators.required],
      email: ["", [Validators.required,Validators.email]],
      phoneNumber: ["",[Validators.required,Validators.pattern('(84|0[3|5|7|8|9])+([0-9]{8})\\b')]],
      birthDay: ["", Validators.required],
      homeTown: ["", Validators.required],
      gender: ["Nam", Validators.required],
    });

  }

  getByUserName() {
    const userinfo = JSON.parse(localStorage.getItem("auth-user"));
    const name = userinfo.sub;
  

    this.profileService.getProfile(name).subscribe((res) => {
      this.updateForm(res);
      this.user=res;
      this.profileService.viewImage(this.user.avatarName).subscribe(data=>{
      this.postResponse = data;
        this.dbImage= "data:image/jpeg;base64," + this.postResponse.image;
        this.profileService.tranferData(this.postResponse.image);
    })
    });
    
  }

  onSelect(file: File) {
    this.isChange=true;
    this.labelImport.nativeElement.innerText = file[0].name;
    this.fileToUpload = file[0];
    this.filea=file[0];
     console.log(this.filea);
    var reader = new FileReader();
    reader.readAsDataURL(file[0]);
    reader.onload = (event) => {
      this.dbImage = event.target.result;
      console.log(this.dbImage)
    };
   
  }
  updateForm(user: User): void {
    this.formProfile.patchValue({
      id: user.id,
      avatarName:user.avatarName,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      birthDay: formatDate(user.birthDay,'MM/dd/yyyy','en'),
      homeTown: user.homeTown,
      gender: user.gender,
    });
    
  }
  imageUploadAction() {
    const imageFormData = new FormData();
    imageFormData.append("image", this.fileToUpload, this.fileToUpload.name);
    console.log(imageFormData)
    this.httpClient
      .post("http://localhost:9090/api/public/upload/image/", imageFormData, {
        observe: "response",
      })
      .subscribe((response) => {
        if (response.status === 200) {
          this.postResponse = response;
          this.successResponse = this.postResponse.body.message; 
          this.getByUserName();
          this.profileService.tranferData(this.postResponse.image);
        } else {
          this.successResponse = "Image not uploaded due to some error!";
        }
      });
     
  }

  viewImage() {
    this.profileService.viewImage(this.user.avatarName).subscribe(data=>{
      this.postResponse = data;
        this.dbImage= "data:image/jpeg;base64," + this.postResponse.image;
    })
  }
  onSubmit(){
    if(this.isChange){
      this.formProfile.patchValue({
        avatarName:this.filea.name
      });
    }
    const date=new Date(this.formProfile.controls.birthDay.value);
    this.formProfile.patchValue({
      birthDay:date
    });
    this.profileService.updateProfile(this.formProfile.value).subscribe(data=>{
      if(data!=null){
        this.showToaster("Cập nhật thành công","success")
      }
    });
    if(this.isChange) {
      this.imageUploadAction();
    }
    
  }
  showToaster(message: string,typea:any) {
    const type = typea;
    this.toaster.open({
      text: message,
      caption: 'Thành công',
      type: type,
      duration: 3000
    });
  }
}
