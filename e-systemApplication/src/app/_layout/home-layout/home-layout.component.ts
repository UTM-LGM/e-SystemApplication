import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.css']
})
export class HomeLayoutComponent {

  constructor(
    private router:Router,
    private msalService:MsalService
  ){}

  logOut(){
    this.msalService.logoutRedirect({
      postLogoutRedirectUri: 'https://www5.lgm.gov.my/e-SystemApplication/login'
    });
    localStorage.clear();
  }
}
