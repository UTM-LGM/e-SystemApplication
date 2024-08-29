import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, Router, CanActivateFn } from "@angular/router";
import { MsalService } from "@azure/msal-angular";
import { SharedService } from "../_services/shared.service";
import { EmployeesService } from "../_services/employees.service";
import jwt_decode from 'jwt-decode';
import { RegisterSystemRoleService } from "../_services/register-system-role.service";

export const authGuard: CanActivateFn = async (next: ActivatedRouteSnapshot) => {
  const msalService = inject(MsalService);
  const sharedService = inject(SharedService);
  const router = inject(Router);
  const employeeService = inject(EmployeesService);
  const systemRoleService = inject(RegisterSystemRoleService);

  const accounts = msalService.instance.getAllAccounts();
  if (accounts.length > 0) {
    return await setAccessToken();
  } else {
    router.navigateByUrl('/login');
    return false;
  }

  async function setAccessToken(): Promise<boolean> {
    await msalService.instance.initialize();
    //const clientId = 'ed4b3e6f-1c2c-4b37-8535-0ed0088a5bea';
    const clientId = '07e1a70e-5795-41e9-9b46-0b765cec9306'
    const tokenInfoString = localStorage.getItem(`msal.token.keys.${clientId}`);
    if (tokenInfoString !== null) {
      const tokenInfo = JSON.parse(tokenInfoString);
      if (tokenInfo.accessToken) {
        setIdToken(tokenInfo);
        const accessToken = tokenInfo.accessToken[0];
        const secret = localStorage.getItem(accessToken);
        if (secret !== null) {
          const secretInfo = JSON.parse(secret);
          localStorage.setItem('accessToken', secretInfo.secret);
          return await decodeAccessToken();
        }
      }
    }
    return false;
  }

  function setIdToken(tokenInfo: any): void {
    if (tokenInfo.idToken) {
      const idToken = tokenInfo.idToken[0];
      const secret = localStorage.getItem(idToken);
      if (secret !== null) {
        const secretInfo = JSON.parse(secret);
        localStorage.setItem('idToken', secretInfo.secret);
        decodeIdToken();
      }
    }
  }

  async function decodeAccessToken(): Promise<boolean> {
    const token = localStorage.getItem('accessToken');
    if (token !== null) {
      const decodedToken: any = jwt_decode(token);
      sharedService.roles = decodedToken.roles || [];

      const currentTime = new Date().getTime();
      if (decodedToken.exp * 1000 < currentTime) {
        console.log('Token has expired, redirecting to login...');
        localStorage.clear();
        router.navigateByUrl('/login');
        return false;
      } else {
        return await loadUserAndRoleData();
      }
    } else {
      console.log('No token found, redirecting to login...');
      localStorage.clear();
      router.navigateByUrl('/login');
      return false;
    }
  }

  function decodeIdToken(): void {
    const token = localStorage.getItem('idToken');
    if (token !== null) {
      const decodedToken: any = jwt_decode(token);
      if (decodedToken !== null) {
        sharedService.email = decodedToken.email;
        sharedService.name = decodedToken.name;
      }
    }
  }

  async function loadUserAndRoleData(): Promise<boolean> {
    try {
      const userResponse = await employeeService.getEmplyeesByEmail(sharedService.email).toPromise();
      sharedService.userId = userResponse.emp_id;

      const roleResponse = await systemRoleService.getSystemRoleByUserId(sharedService.userId).toPromise();
      if (roleResponse) {
        sharedService.roles.push(roleResponse.role);
        sharedService.systems = roleResponse.systemIds;
      } else {
        sharedService.roles.push('user');
      }
      return true;
    } catch (error) {
      console.error('Error fetching user or role data:', error);
      router.navigateByUrl('/login');
      return false;
    }
  }
};
