import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeLayoutComponent } from './_layout/home-layout/home-layout.component';
import { LoginLayoutComponent } from './_layout/login-layout/login-layout.component';
import { HomeComponent } from './home/home.component';
import { RegisterSystemComponent } from './utility/register-system/register-system.component';
import { RegisterSystemRoleComponent } from './utility/register-system-role/register-system-role.component';
import { RegisterSystemOwnerComponent } from './utility/register-system-owner/register-system-owner.component';
import { NewRequestApplicationComponent } from './new-request-application/new-request-application.component';
import { RequestedApplicationComponent } from './pending-approval/requested-application.component';
import { ApprovedApplicationComponent } from './pending-assign/approved-application.component';
import { ApprovedApplicationListComponent } from './approved-application-list/approved-application-list.component';
import { ReportComponent } from './report/report.component';
import { LoginComponent } from './login/login.component';
import { MsalGuard } from '@azure/msal-angular';
import { AuthGuard } from './_interceptor/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: 'login', component: LoginLayoutComponent,
    children: [
      { path: '', component: LoginComponent },
    ]
  },
  { path: '', component: HomeLayoutComponent, canActivate: [MsalGuard, AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'utility-register-system', component: RegisterSystemComponent},
      { path: 'utility-register-systemRole', component: RegisterSystemRoleComponent},
      { path: 'utility-register-systemOwner', component: RegisterSystemOwnerComponent},
      { path: 'new-requestApplication', component: NewRequestApplicationComponent},
      { path: 'requested-application', component: RequestedApplicationComponent},
      { path: 'approved-application-list', component: ApprovedApplicationListComponent},
      { path: 'approved-application', component:ApprovedApplicationComponent},
      { path: 'report', component:ReportComponent}
    ]
  },  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
