import { Component, OnInit } from "@angular/core";
import { JobService } from "../../../@core/services/job.service";
import { Router } from "@angular/router";
import { JobRegisterService } from "../../../@core/services/job-register.service";
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: "ngx-jobs-register",
  templateUrl: "./jobs-register.component.html",
  styleUrls: ["./jobs-register.component.scss"],
})
export class JobsRegisterComponent implements OnInit {
  pageNo = 0;
  pageSize = 2;
  totalPage = 0;
  totalJob = 0;
  listJobsRegister: any;
  totalPageNumRe: Number[] = [];
  totalPageNum: Number[] = [];
  index: Number[] = [];
  sortBy = "dateRegister";
  sortSearchBy = "date_register";
  sortDir = "asc";
  isClick = false;
  isSearch = false;
  name='';
  constructor(
    private jobRegisterService: JobRegisterService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.jobRegisterService
      .getAllJobRegister(this.pageNo, this.pageSize, this.sortBy, this.sortDir)
      .subscribe((data) => {
        this.getData(data);
      });
  }

  getData(data) {
    const start = 0;
    this.listJobsRegister = data.jobsRegisters;
    this.pageNo = data.pageNo;
    this.pageSize = data.pageSize;
    this.totalJob = data.totalElements;
    this.totalPage = data.totalPages;
    this.totalPageNumRe = Array(this.totalPage)
      .fill(1)
      .map((x, i) => i);
    this.totalPageNum = this.totalPageNumRe.slice().reverse();
    this.index = Array(this.listJobsRegister.length)
      .fill(0)
      .map((x, i) => i);
  }
  changePageSize(e) {
    if (!this.isSearch) {
      this.jobRegisterService
        .getAllJobRegister(this.pageNo, e.target.value, this.sortBy, this.sortDir)
        .subscribe((data) => {
          this.getData(data);
        });
      }
    else {
      const data = {
        name: this.name,
        pageNo: this.pageNo,
        totalPages: this.totalPage,
        pageSize: e.target.value,
        sortBy: this.sortSearchBy,
        sortDir: this.sortDir,
      };
      this.jobRegisterService.searchJobRegister(data).subscribe((data) => {
        this.getData(data);
        this.isSearch = true;
      });
    }
  }

  onClick(page) {
    if (!this.isSearch) {
      this.pageNo = page;
      this.router.navigate(["/home/job-register"]);
      this.jobRegisterService
        .getAllJobRegister(this.pageNo, this.pageSize, this.sortBy, this.sortDir)
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
      this.router.navigate(["/home/job-register"]);
      this.jobRegisterService.searchJobRegister(data).subscribe((data) => {
        this.getData(data);
        this.isSearch = true;
      });
    }

  }
  sortByDueDate() {
    if (!this.isClick) {
      this.sortDir = "desc";
      this.isClick = true;
    } else {
      this.sortDir = "asc";
      this.isClick = false;
    }
    this.sortBy = "dateRegister";
    this.jobRegisterService
      .getAllJobRegister(this.pageNo, this.pageSize, this.sortBy, this.sortDir)
      .subscribe((data) => {
        this.getData(data);
      });
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
    this.jobRegisterService.searchJobRegister(data).subscribe((data) => {
      this.getData(data);
      this.isSearch = true;
    });
  }



}
