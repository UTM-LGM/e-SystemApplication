import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HomeLayoutComponent } from './_layout/home-layout/home-layout.component';
import { LoginLayoutComponent } from './_layout/login-layout/login-layout.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { RegisterSystemComponent } from './utility/register-system/register-system.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CommonModule } from '@angular/common';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { RegisterSystemRoleComponent } from './utility/register-system-role/register-system-role.component';
import { RegisterSystemOwnerComponent } from './utility/register-system-owner/register-system-owner.component';
import { NewRequestApplicationComponent } from './new-request-application/new-request-application.component';
import { RequestedApplicationComponent } from './pending-approval/requested-application.component';
import { ApprovedApplicationComponent } from './pending-assign/approved-application.component';
import { ApprovedApplicationListComponent } from './approved-application-list/approved-application-list.component';
import { ReportComponent } from './report/report.component';
import { LoginComponent } from './login/login.component';
import { MsalBroadcastService, MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent, MsalService } from '@azure/msal-angular';
import { BrowserCacheLocation, InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { SpinnerComponent } from './spinner/spinner.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeLayoutComponent,
    LoginLayoutComponent,
    SidenavComponent,
    HomeComponent,
    RegisterSystemComponent,
    RegisterSystemRoleComponent,
    RegisterSystemOwnerComponent,
    NewRequestApplicationComponent,
    RequestedApplicationComponent,
    ApprovedApplicationComponent,
    ApprovedApplicationListComponent,
    ReportComponent,
    LoginComponent,
    SpinnerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    NgxPaginationModule,
    NgxSkeletonLoaderModule,
    HttpClientModule,
    CommonModule,
    MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: "07e1a70e-5795-41e9-9b46-0b765cec9306", // Application (client) ID from the app registration
          authority:
            "https://login.microsoftonline.com/22f0712b-5def-4d21-a16e-30e5e334541e", // The Azure cloud instance and the app's sign-in audience (tenant ID, common, organizations, or consumers)
          redirectUri: "https://www5.lgm.gov.my/e-SystemApplication/home", // This is your redirect URI

        },
        cache: {
          cacheLocation: BrowserCacheLocation.LocalStorage,
          //Can be set true or false
          storeAuthStateInCookie: true, // Set to true for Internet Explorer 11
        },

        // auth: {
        //     clientId: "ed4b3e6f-1c2c-4b37-8535-0ed0088a5bea", // Application (client) ID from the app registration
        //     authority:
        //       "https://login.microsoftonline.com/22f0712b-5def-4d21-a16e-30e5e334541e", // The Azure cloud instance and the app's sign-in audience (tenant ID, common, organizations, or consumers)
        //     redirectUri: "http://localhost:4200/home", // This is your redirect URI
  
        //   },
        //   cache: {
        //     cacheLocation: BrowserCacheLocation.LocalStorage,
        //     //Can be set true or false
        //     storeAuthStateInCookie: true, // Set to true for Internet Explorer 11
        //   },

      }),
      {
        interactionType: InteractionType.Redirect, // MSAL Guard Configuration
        authRequest: {
          scopes: ["api://e-SystemApplicationAPI/.default"],
        },
      },
      {
        interactionType: InteractionType.Redirect, // MSAL Interceptor Configuration
        protectedResourceMap: new Map([
          ["https://graph.microsoft.com/User.Read", ["User.Read"]],
        ]),
      }
    ),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
