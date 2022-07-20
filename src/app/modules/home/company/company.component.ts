import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Toaster } from "ngx-toast-notifications";
import { Company } from "../../../@core/models/company";
import { CompanyService } from "../../../@core/services/company.service";

@Component({
  selector: "ngx-company",
  templateUrl: "./company.component.html",
  styleUrls: ["./company.component.scss"],
})
export class CompanyComponent implements OnInit {
  [x: string]: any;
  companyDetail: FormGroup;
  idCompany = 1;
  companyD: Company = new Company();
  date = new Date();
  constructor(
    private toaster: Toaster,
    private companyService: CompanyService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getCompany();
  }
  initForm() {
    this.companyDetail = this.formBuilder.group({
      id: new FormControl(this.idCompany, [Validators.required]),
      name: new FormControl("", [Validators.required,Validators.maxLength(50)]),
      email: new FormControl("", [Validators.required,Validators.email]),
      hotLine: new FormControl("", [Validators.required,Validators.pattern("(84|0[3|5|7|8|9])+([0-9]{8})\\b"),]),
      dateIncoporation: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required,Validators.maxLength(2000),Validators.minLength(20)]),
      taxDate: new FormControl("", [Validators.required]),
      avatar: new FormControl("", [Validators.required,Validators.maxLength(100)]),
      taxCode: new FormControl("", [Validators.required,Validators.maxLength(100)]),
      taxPlace: new FormControl("", [Validators.required,Validators.maxLength(100)]),
      headOffice: new FormControl("", [Validators.required,Validators.maxLength(100)]),
      numberStaff: new FormControl("", [Validators.required,Validators.maxLength(100)]),
      backdropImg: new FormControl("", [Validators.required,Validators.maxLength(100)]),
      linkWeb: new FormControl("", [Validators.required,Validators.maxLength(100)]),
    });
  }

  infoCompany(company: Company) {
    this.companyDetail.controls["name"].setValue(company.name);
    this.companyDetail.controls["email"].setValue(company.email);
    this.companyDetail.controls["hotLine"].setValue(company.hotLine);
    this.companyDetail.controls["dateIncoporation"].setValue(
      company.dateIncoporation
    );
    this.companyDetail.controls["description"].setValue(company.description);
    this.companyDetail.controls["taxDate"].setValue(company.taxDate);
    this.companyDetail.controls["avatar"].setValue(company.avatar);
    this.companyDetail.controls["taxCode"].setValue(company.taxCode);
    this.companyDetail.controls["taxPlace"].setValue(company.taxPlace);
    this.companyDetail.controls["headOffice"].setValue(company.headOffice);
    this.companyDetail.controls["numberStaff"].setValue(company.numberStaff);
    this.companyDetail.controls["backdropImg"].setValue(company.backdropImg);
    this.companyDetail.controls["linkWeb"].setValue(company.linkWeb);
  }

  getCompany() {
    this.companyService.getCompanyById(this.idCompany).subscribe((data) => {
      this.companyD = data;
      this.infoCompany(this.companyD);
    });
  }

  updateCompany() {
    this.companyService.updateCompany(this.companyDetail.value).subscribe(
      (data) => {
        this.getCompany();
        if (data.statusCode == "OK") {
          this.showToaster("Thay đổi thành công.", "success");
        }
        if (data.statusCode == "NOT_FOUND") {
          this.showToaster("Thay đổi không thành công.", "danger");
        }
      },
      (error) => {
        console.log(error);
        if (
          error.status == "500" ||
          error.status == "400" ||
          error.statusCode == "NOT_FOUND"
        ) {
          this.showToaster("Thay đổi không thành công.", "danger");
        }
      }
    );
  }

  showToaster(message: string, typea: any) {
    const type = typea;
    this.toaster.open({
      text: message,
      caption: "Status",
      type: type,
      duration: 3000,
    });
  }
}
