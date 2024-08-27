import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { MsalService } from "@azure/msal-angular";
import { Observable, of } from "rxjs";
import { SharedService } from "../_services/shared.service";
import { EmployeesService } from "../_services/employees.service";
import jwt_decode from 'jwt-decode';
import { SystemRole } from "../_interface/systemRole";
import { RegisterSystemRoleService } from "../_services/register-system-role.service";


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  user: any = {};

  constructor(
    private employeeService: EmployeesService,
    private sharedService: SharedService,
    private router: Router,
    private msalService: MsalService,
    private systemRoleService: RegisterSystemRoleService
  ) {}

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const accounts = this.msalService.instance.getAllAccounts();
    if (accounts.length > 0) {
      return this.setAccessToken(); // Ensure token is set and user data is fetched
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }

  async setAccessToken(): Promise<boolean> {
    await this.msalService.instance.initialize();
    const clientId = '07e1a70e-5795-41e9-9b46-0b765cec9306';

    const tokenInfoString = localStorage.getItem(`msal.token.keys.${clientId}`);
    if (tokenInfoString !== null) {
      const tokenInfo = JSON.parse(tokenInfoString);
      if (tokenInfo.accessToken) {
        this.setIdToken(tokenInfo);
        const accessToken = tokenInfo.accessToken[0];
        const secret = localStorage.getItem(accessToken);
        if (secret !== null) {
          const secretInfo = JSON.parse(secret);
          localStorage.setItem('accessToken', secretInfo.secret);
          return this.decodeAccessToken();
        }
      }
    }
    return false; // Return false if no valid token is found
  }

  setIdToken(tokenInfo: any): void {
    if (tokenInfo.idToken) {
      const idToken = tokenInfo.idToken[0];
      const secret = localStorage.getItem(idToken);
      if (secret !== null) {
        const secretInfo = JSON.parse(secret);
        localStorage.setItem('idToken', secretInfo.secret);
        this.decodeIdToken();
      }
    }
  }

  async decodeAccessToken(): Promise<boolean> {
    const token = localStorage.getItem('accessToken');
    if (token !== null) {
      const decodedToken: any = jwt_decode(token);
      this.sharedService.roles = decodedToken.roles || [];

      const currentTime = new Date().getTime();
      if (decodedToken.exp * 1000 < currentTime) {
        console.log('Token has expired, redirecting to login...');
        localStorage.clear();
        this.router.navigateByUrl('/login');
        return false;
      } else {
        if (this.sharedService.roles.length > 0) {
          console.log('Role found in token, proceeding...');
          return true; // Role is already available
        } else {
          console.log('Role not found in token, fetching from service...');
          return this.loadUserAndRoleData(); // Load user and role data from service
        }
      }
    } else {
      console.log('No token found, redirecting to login...');
      localStorage.clear();
      this.router.navigateByUrl('/login');
      return false;
    }
  }


  decodeIdToken(): void {
    const token = localStorage.getItem('idToken');
    if (token !== null) {
      const decodedToken: any = jwt_decode(token);
      if (decodedToken !== null) {
        this.sharedService.email = decodedToken.email;
        this.sharedService.name = decodedToken.name
      }
    }
  }

  async loadUserAndRoleData(): Promise<boolean> {
    try {
      // Fetch user data based on email
      const userResponse = await this.employeeService.getEmplyeesByEmail(this.sharedService.email).toPromise();
      this.user = userResponse;
      this.sharedService.userId = this.user.emp_id;

      // Fetch role and system data
      const roleResponse = await this.systemRoleService.getSystemRoleByUserId(this.sharedService.userId).toPromise();
      if (roleResponse) {
        this.sharedService.roles.push(roleResponse.role)
        this.sharedService.systems = roleResponse.systemIds;
      }
      else{
        this.sharedService.roles.push('user')
      }
      return true; // Allow navigation after data is fetched
    } catch (error) {
      console.error('Error fetching user or role data:', error);
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}
