import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Toaster } from 'ngx-toast-notifications';
import { job } from '../../../@core/models/job';
import { JobRegisterPublic } from '../../../@core/models/jobRegisterPublic';
import { RecruitmentService } from '../../../@core/services/recuitment-public.service';
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ngx-detailJob',
  templateUrl: './detail-job-public.component.html',
  styleUrls: ['./detail-job-public.component.scss'],
})
export class DetaileJobPComponent implements OnInit {
  [x: string]: any;
  jobId: any;
  data: any;
  jobObj: job = new job();
  workingForm: any;
  profileP: FormGroup;
  userName: string;
  role: string;
  filetoUpload: any;
  jobRegPObj: JobRegisterPublic = new JobRegisterPublic();

  checkloggin = false;

  constructor(
    private router: ActivatedRoute,
    private recruitmentService: RecruitmentService,
    private formBuilder: FormBuilder,
    private toaster: Toaster,
    private httpClient: HttpClient,
  ) {}
  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      this.jobId = params['id'];
    });

    this.getJobDetail();
    this.initForm();
  }
  initForm() {
    this.profileP = this.formBuilder.group({
      pdf: new FormControl('1', [Validators.required]),
    });
  }
  getJobDetail() {
    if (this.jobId) {
      this.recruitmentService.getDetailJobById(this.jobId).subscribe((data) => {
        this.data = data;
        this.jobObj = data;
      });
    } else {
      alert('LỖi');
    }
  }
 
  registerJob() {
    const userinfo = JSON.parse(localStorage.getItem('auth-user'));
    if (!userinfo) {
      this.checkloggin = false;
    } else {
      this.role = userinfo.auth;
      this.userName = userinfo.sub;
      if (
        this.role === 'ROLE_ADMIN' ||
        this.role === 'ROLE_JE' ||
        this.role === 'ROLE_USER'
      ) {
        this.checkloggin = true;
        this.jobRegPObj.userName = this.userName;
      }
    }
    // eslint-disable-next-line eqeqeq
    if (this.jobId != null && this.checkloggin == true) {
      this.jobRegPObj.jobId = this.jobId;
      if (this.nameFIle != null) {
        this.jobRegPObj.pdf = this.nameFIle;
      }
      this.recruitmentService.registerJob(this.jobRegPObj).subscribe(
        (data) => {
          console.log(data);
          // eslint-disable-next-line eqeqeq
          if (data.statusCode == 'OK') {
            this.showToaster(
              'Apple thành công, chúng tôi sẽ liên hệ sớm nhất.',
              'success',
            );
            //this.uploadFilePdf();
            this.profileP.reset();
          } else {
            this.showToaster(
              'Apple không thành công thành công, chúng tôi sẽ liên hệ sớm nhất.',
              'danger',
            );
          }
        },
        (error) => {
          console.log(error);
          // eslint-disable-next-line eqeqeq
          if (error.status == '500') {
            this.showToaster('Mỗi một job chỉ được apply 1 lần.', 'danger');
          }
        },
      );
    } else {
      this.showToaster('Đăng nhập trước khi apply.', 'danger');
    }
  }
  onChange(file: File) {
    this.fileToUpload = file[0];
    console.log(this.fileToUpload);
  }

  uploadFilePdf() {
    const formDataUpLoad = new FormData();
    formDataUpLoad.append('file', this.fileToUpload);
    this.httpClient
      .post('http://localhost:9090/api/public/uploadFile', formDataUpLoad, {
        observe: 'response',
      })
      .subscribe((response) => {
        if (response.status === 200) {
          alert('a');
        } else {
          alert('b');
        }
      });
  }

  showToaster(message: string, typea: any) {
    const type = typea;
    this.toaster.open({
      text: message,
      caption: 'Status',
      type,
      duration: 3000,
    });
  }
}
