import { formatDate } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

import { Chart } from "chart.js";
import { Statistical } from "../../../@core/models/statistical";
import { StatisticalService } from "../../../@core/services/statistical.service";

@Component({
  selector: "ngx-statistical",
  templateUrl: "./statistical.component.html",
  styleUrls: ["./statistical.component.scss"],
})
export class StatisticalComponent implements OnInit {
  monthchosse = [2015, 2016, 2017, 2018, 2019, 2020, 2021];
  total_view_job = 0;
  success_recruited_applicant = 0;
  total_apply = 0;
  waiting_for_interview = 0;
  interviewing = 0;
  all_job = 0;
  month = 1;
  setdateS = "01012022";
  false_applicant = 0;
  jobFaile = "4";
  seachData: FormGroup;
  liveCharrt: any;
  jobs: any;
  myDate = new Date();
  cValue = formatDate(this.myDate, "ddMMyyyy", "en-US");

  statisticalObj: Statistical = new Statistical();
  data: number[] = new Array();
  datapip: number[] = new Array();
  jobSa: String[] = new Array();
  statisList: Statistical[];

  constructor(
    private formBuilder: FormBuilder,
    private statisticalService: StatisticalService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.chart();
    this.getAllUserJe();
    console.log(this.cValue);
    console.log(this.seachData.value);
  }

  initForm() {
    this.seachData = this.formBuilder.group({
      dateend: new FormControl("20072022", [Validators.required]),
      datestart: new FormControl("01012022", [Validators.required]),
      month: new FormControl("1", [Validators.required]),
    });
  }
  dateS(event: any) {
    const s = event.target.value;
    const sx = s.split("-");
    this.seachData.value.datestart = sx[2] + sx[1] + sx[0];
    this.setdateS = this.seachData.value.datestart;
  }
  dateE(event: any) {
    if (!this.seachData.value.datestart) {
      this.seachData.value.datestart = "01012022";
    } else {
      this.seachData.value.datestart = this.setdateS;
    }
    const s = event.target.value;
    const sx = s.split("-");
    this.seachData.value.dateend = sx[2] + sx[1] + sx[0];
    console.log(this.seachData.value);

    this.getAllUserJe();
  }

  date() {
    if ((this.seachData.value.datestart = null)) {
      this.seachData.value.datestart = "20220101";
    }
    if ((this.seachData.value.dateend = null)) {
      this.seachData.value.dateend = "20221212";
    }
    console.log(this.seachData.value);

    this.statisticalService
      .getStatistical(this.seachData.value)
      .subscribe((res) => {});
  }

  getAllUserJe() {
    this.statisticalService.getStatistical(this.seachData.value).subscribe(
      (res) => {
        this.statisticalObj = res[0];
        console.log(this.statisticalObj);

        this.total_apply = this.statisticalObj.total_apply;
        this.success_recruited_applicant =
          this.statisticalObj.success_recruited_applicant;
        this.false_applicant = this.statisticalObj.false_applicant;
        this.jobs = [
          {
            name: "Ứng tuyển",
            value: this.total_apply,
          },
          {
            name: "Đã tuyển",
            value: this.success_recruited_applicant,
          },
          {
            name: "Từ chối",
            value: this.false_applicant,
          },
        ];

        (this.data[0] = 5),
          (this.data[1] = 10),
          (this.data[2] = 11),
          (this.data[3] = 15),
          (this.data[4] = 12),
          (this.data[5] = 5),
          (this.data[6] = 10),
          (this.data[7] = 11),
          (this.data[8] = 15),
          (this.data[9] = 21),
          (this.data[10] = 15),
          (this.data[11] = 21);
      },
      (err) => {
        console.log("error while fetching data.");
      }
    );
  }
  selectMonth(month: number) {
    alert(month);
  }
  canvas: any;
  ctx: any;
  chart() {
    this.canvas = document.getElementById("myChart");
    this.ctx = this.canvas.getContext("2d");

    this.liveCharrt = new Chart(this.ctx, {
      type: "line",
      data: {
        datasets: [
          {
            label: "Số ứng viên tuyển thành công",
            data: this.data,
            borderColor: "#007ee7",
            fill: true,
          },
          {
            label: "Số thành viên cần tuyển",
            data: [0, 12, 11, 21, 20, 12, 21, 30, 55, 57, 59, 60],
            borderColor: "#FEB139",
            fill: true,
          },
        ],
        labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      },
    });
  }

  jobSalesMulti: any[];
  view: any[] = [600, 300];
  showLegend: boolean = true;
  showLabels: boolean = true;
  gradient: boolean = false;
  isDoughnut: boolean = true;
  legendPosition: string = "below";
  colorScheme = {
    domain: ["#704FC4", "#4B852C", "#B67A3D"],
  };
  onActivate(data): void {
    console.log("Activate", JSON.parse(JSON.stringify(data)));
  }
  onDeactivate(data): void {
    console.log("Deactivate", JSON.parse(JSON.stringify(data)));
  }
  onSelect(data): void {
    console.log("Item clicked", JSON.parse(JSON.stringify(data)));
  }
}
