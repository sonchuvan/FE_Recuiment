import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean |
      UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (window.localStorage.getItem('auth-token')) {
      if (localStorage.getItem("auth-user") != null) {
        const userinfo = JSON.parse(localStorage.getItem("auth-user"));
        const role = userinfo.auth;
        if (role === "ROLE_USER"){
            this.router.navigate(["/list-je"]);
            return false;
        }
      return true;
    }
    this.router.navigate(['/auth/'], { queryParams: { returnUrl: state.url } });
    return true;
  }
      }
}
