import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SessionService } from '../../../@core/services/session.service';
import { Router } from '@angular/router';
import { LocalService } from '../../../@core/services/local.service';
import { ProfileService } from '../../../modules/home/profile/profile.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  picture='iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAG1BMVEVEeef///+4zPaKq/ChvPPn7' +
  'vxymu3Q3flbieqI1HvuAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAQUlEQVQ4jWNgGAWjgP6ASdncAEaiAhaGiACmFhCJLsMaIiDAEQEi0WXYEiMC' +
  'OCJAJIY9KuYGTC0gknpuHwXDGwAA5fsIZw0iYWYAAAAASUVORK5CYII=';

  name=this.localService.getItem('auth-user').sub;

  themes = [
    {
      value: 'default',
      name: 'Mặc định',
    },
    {
      value: 'dark',
      name: 'Bóng đêm',
    },
    {
      value: 'cosmic',
      name: 'Huyền ảo',
    },
    {
      value: 'corporate',
      name: 'Tối giản',
    },
  ];

  currentTheme = 'default';

  userMenu = [ { title: 'Thông tin cá nhân' },{ title: 'Đổi mật khẩu' }, { title: 'Đăng xuất'   } ];

  postResponse;

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              private sessionService: SessionService,
              private localService: LocalService,
              private router: Router,
              private profileService:ProfileService
              ) {
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    this.user = this.sessionService.getItem('auth-user');

    this.menuService.onItemClick().subscribe((event)=>{
      if(event.item.title==='Đăng xuất'){
        this.localService.removeItem('auth-token'),
        this.localService.removeItem('auth-user'),
        localStorage.removeItem('user');
        this.router.navigate(['/auth/'])
      }
      if(event.item.title==='Thông tin cá nhân'){
        this.router.navigate(['/home/profile'])
      }
      if(event.item.title==='Đổi mật khẩu'){
        this.router.navigate(['/home/change-the-password'])
      }
    });

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
      this.getByUserName();
      
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }
  getByUserName() {
    // const userinfo = JSON.parse(localStorage.getItem("auth-user"));
    // const name = userinfo.sub;
    // this.profileService.getProfile(name).subscribe((res) => {
    //   this.user=res;
    //   this.profileService.viewImage(this.user.avatarName).subscribe(data=>{
    //   this.postResponse = data;
    //     this.profileService.picture= this.postResponse.image;
    // })
    //});
  }
  
  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}