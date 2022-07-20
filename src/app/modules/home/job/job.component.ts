import { Component, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import { job } from "../../../@core/models/job";
import { JobService } from "../../../@core/services/job.service";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";


import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from "@angular/forms";

import { Toaster } from "ngx-toast-notifications";
import { table } from "console";

@Component({
  selector: "ngx-job",
  templateUrl: "./job.component.html",
  styleUrls: ["./job.component.scss"],
})
export class JobComponent implements OnInit {
  pageNo = 0;
  pageSize = 5;
  totalPage = 0;
  totalJob = 0;
  listJob: job[] = [];
  totalPageNumRe: Number[] = [];
  totalPageNum: Number[] = [];
  index: Number[] = [];
  sortBy = "dueDate";
  sortSearchBy = "J.due_date";
  sortDir = "asc";
  isClick = false;
  statusJob;
  name = "";
  isSearch = false;
  jobChild;
  isChangeSize = false;
  pdf=false;
  constructor(
    private jobService: JobService,
    private router: Router,
    private dialog: MatDialog,
    private toaster: Toaster
  ) {}

  ngOnInit(): void {
    this.jobService
      .getAllJob(this.pageNo, this.pageSize, this.sortBy, this.sortDir)
      .subscribe((data) => {
        this.getData(data);
      });
  }

  getData(data) {
    const start = 0;
    this.listJob = data.jobs;
    this.pageNo = data.pageNo;
    this.pageSize = data.pageSize;

    this.totalJob = data.totalElements;    
    if(!this.isChangeSize){
    this.totalPage = data.totalPages;
    }
    this.totalPageNumRe = Array(this.totalPage)
      .fill(1)
      .map((x, i) => i);
    this.totalPageNum = this.totalPageNumRe.slice().reverse();
    this.index = Array(this.listJob.length)
      .fill(0)
      .map((x, i) => i);
  }

  onClick(page) {
    if (!this.isSearch) {
      this.pageNo = page;
      this.router.navigate(["/home/job"]);
      this.jobService
        .getAllJob(this.pageNo, this.pageSize, this.sortBy, this.sortDir)
        .subscribe((data) => {
          this.getData(data);
        });
    } else {
      const data = {
        name: this.name,
        pageNo: page,
        totalPages: this.totalPage,
        pageSize: this.pageSize,
        sortBy: this.sortSearchBy,
        sortDir: this.sortDir,
      };
      this.router.navigate(["/home/job"]);
      this.jobService.searchJob(data).subscribe((data) => {
        this.getData(data);
        this.isSearch = true;
      });
    }
  }
  // addJobDetail(value:job){
  //   this.jobDetail.emit(value);
  // }
  tranferJob(job: job) {
    this.jobService.tranferData(job);
  }
  getDetail(job: job) {
    this.router.navigate([`/home/job/detail?id=${job.id}`]);
  }
  openFormAdd() {
    console.log(1);
    this.router.navigate(["/home/job/add"]);
  }
  sortByName() {
    if (!this.isClick) {
      this.sortDir = "desc";
      this.isClick = true;
    } else {
      this.sortDir = "asc";
      this.isClick = false;
    }
    this.sortSearchBy = "J.name";
    const data = {
      name: this.name,
      pageNo: this.pageNo,
      totalPages: this.totalPage,
      pageSize: this.pageSize,
      sortBy: this.sortSearchBy,
      sortDir: this.sortDir,
    };
    this.jobService.searchJob(data).subscribe((data) => {
      this.getData(data);
      this.isSearch = true;
    });
  }
  sortByDueDate() {
    if (!this.isClick) {
      this.sortDir = "desc";
      this.isClick = true;
    } else {
      this.sortDir = "asc";
      this.isClick = false;
    }
    this.sortSearchBy = "J.due_date";
    const data = {
      name: this.name,
      pageNo: this.pageNo,
      totalPages: this.totalPage,
      pageSize: this.pageSize,
      sortBy: this.sortSearchBy,
      sortDir: this.sortDir,
    };
    this.jobService.searchJob(data).subscribe((data) => {
      this.getData(data);
      this.isSearch = true;
    });
  }

   downloadPDF(id) {
    console.log(id);
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/home/job-pdf/export/'+id])
   
    );  
     
    window.open(url, '_blank');
    
  }

  changePageSize(e) {
    this.isChangeSize=true;
    if (!this.isSearch) {
      this.jobService
        .getAllJob(this.pageNo, e.target.value, this.sortBy, this.sortDir)
        .subscribe((data) => {
          this.getData(data);
        });
    } else {
      const data = {
        name: this.name,
        pageNo: this.pageNo,
        totalPages: this.totalPage,
        pageSize: e.target.value,
        sortBy: this.sortSearchBy,
        sortDir: this.sortDir,
      };
      this.jobService.searchJob(data).subscribe((data) => {
        this.getData(data);
        this.isSearch = true;
      });
    }
  }
  onChangeEvent(event: any) {
    const data = {
      name: event.target.value,
      pageNo: this.pageNo,
      totalPages: this.totalPage,
      pageSize: this.pageSize,
      sortBy: this.sortSearchBy,
      sortDir: this.sortDir,
    };
    this.name = event.target.value;
    this.jobService.searchJob(data).subscribe((data) => {
      this.getData(data);
      console.log(this.listJob);
      this.isSearch = true;
    });
  }
  statusRecruiment(id) {
    this.jobService.changeStatus(id, "Đang tuyển").subscribe((data) => {
      if (data != null) {
        this.showToaster("Đang tuyển tin tuyển dụng thành công", "success");
        this.jobService
        .getAllJob(this.pageNo, this.pageSize, this.sortBy, this.sortDir)
        .subscribe((data) => {
          this.getData(data);
        });
      } else {
        this.showToaster("Đang tuyển tin tuyển dụng thất bại", "danger");
      }
    });
  }
  showToaster(message: string, typea: any) {
    const type = typea;
    this.toaster.open({
      text: message,
      caption: "Thành công",
      type: type,
      duration: 3000,
    });
  }
  openNewTab(id){
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/public-job/detail/'+id])
    );
    window.open(url, '_blank');
  }
  sortByJobPosition(){
    if (!this.isClick) {
      this.sortDir = "desc";
      this.isClick = true;
    } else {
      this.sortDir = "asc";
      this.isClick = false;
    }
    this.sortSearchBy = "JB.code";
    const data = {
      name: this.name,
      pageNo: this.pageNo,
      totalPages: this.totalPage,
      pageSize: this.pageSize,
      sortBy: this.sortSearchBy,
      sortDir: this.sortDir,
    };
    this.jobService.searchJob(data).subscribe((data) => {
      this.getData(data);
      this.isSearch = true;
    });
  }
  sortBySalary(){
    if (!this.isClick) {
      this.sortDir = "desc";
      this.isClick = true;
    } else {
      this.sortDir = "asc";
      this.isClick = false;
    }
    this.sortSearchBy = "J.salary_max";
    const data = {
      name: this.name,
      pageNo: this.pageNo,
      totalPages: this.totalPage,
      pageSize: this.pageSize,
      sortBy: this.sortSearchBy,
      sortDir: this.sortDir,
    };
    this.jobService.searchJob(data).subscribe((data) => {
      this.getData(data);
      this.isSearch = true;
    });
  }
  sortByStatus(){
    if (!this.isClick) {
      this.sortDir = "desc";
      this.isClick = true;
    } else {
      this.sortDir = "asc";
      this.isClick = false;
    }
    this.sortSearchBy = "S.code";
    const data = {
      name: this.name,
      pageNo: this.pageNo,
      totalPages: this.totalPage,
      pageSize: this.pageSize,
      sortBy: this.sortSearchBy,
      sortDir: this.sortDir,
    };
    this.jobService.searchJob(data).subscribe((data) => {
      this.getData(data);
      this.isSearch = true;
    });
  }
}
