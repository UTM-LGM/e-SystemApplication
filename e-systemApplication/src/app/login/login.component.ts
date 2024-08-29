import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { RedirectRequest } from '@azure/msal-browser';
import { SpinnerService } from '../_services/spinner.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private router: Router,
    private spinnerService:SpinnerService
  ) { }

  ngOnInit() {
    this.checkAuthentication();
  }

  checkAuthentication() {
    this.spinnerService.requestStarted();
    setTimeout(() => {
      this.msalService.handleRedirectObservable().subscribe({
        next: () => {
          const accounts = this.msalService.instance.getAllAccounts();
          if (accounts.length > 0) {
            this.spinnerService.requestEnded();
            this.router.navigateByUrl('/home')
          }
          else {
            this.spinnerService.requestEnded();
            this.router.navigateByUrl('/login')
          }
        },
        error: (err) => {
          localStorage.clear()
        }
      })
    }, 2000)
  }

  async loginSSO() {
    if (this.msalGuardConfig.authRequest) {
      await this.msalService.instance.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
    } else {
      this.msalService.loginRedirect();
    }
  }

}
