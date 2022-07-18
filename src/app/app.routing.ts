import {SignupComponent} from "./modules/signup/signup.component";
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import {ActiveAccountComponent} from "./modules/signup/active-account/active-account.component";
import { ExtraOptions, RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { AuthGuard } from "./@core/guards/auth.guard";
import { ProfileUserPComponent } from "./modules/recruitmentPublic/profileUserP/profileUserP.component";
import { DetaileJobPComponent } from "./modules/recruitmentPublic/detalJob/detailJob.component";
import { RecruitmentPublicComponent } from "./modules/recruitmentPublic/recruitmentPublic.component";
import { PopupApply } from "./modules/recruitmentPublic/popupApply/popupApply.component";


export const routes: Routes = [
  {
    path: "home",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./modules/home/home.module").then((m) => m.HomeModule),
  },
  //xóa itsol
  {
    path: "auth",
    loadChildren: () =>
      import("./modules/auth/auth.module").then((m) => m.AuthModule),
  },
  // { path: '',
  //   redirectTo: 'home',
  //   pathMatch: 'full',
  // },
  // { path: '**',
  //   redirectTo: 'home',
  // },
  {
    path: "forgot-password",
    loadChildren: () =>
      import("./forgot-password/forgot-password.module").then(
        (m) => m.ForgotPasswordModule
      ),
  },
  {
    path:'change-password',
      loadChildren: () => import('./forgot-password/change-password/change-password.module').then(m => m.ChangePasswordModule),
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'profile-public',
    component: ProfileUserPComponent,
  },
  {
    path:'public-job/detail/:id',
    component: DetaileJobPComponent,
  },
  {
    path: 'active',
    component: ActiveAccountComponent,
  },
  {
    path: '',
    loadChildren: () =>
    import("./modules/recruitmentPublic/recruitmentPublic.module").then((m) => m.RecruitmentPublicModule),
  },
  {
    path: 'public-job/apply/:id',
    component: PopupApply ,
  },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
