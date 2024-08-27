import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SystemRole } from '../_interface/systemRole';

@Injectable({
  providedIn: 'root'
})
export class RegisterSystemRoleService {

  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getSystemRoles():Observable<SystemRole[]>{
    return this.http.get<SystemRole[]>(this.baseUrl + '/systemRoles/GetSystemRoles')
  }

  addSystemRole(role:SystemRole):Observable<SystemRole>{
    return this.http.post<SystemRole>(this.baseUrl + '/systemRoles/AddSystemRole', role)
  }

  updateSystemRole(role:SystemRole):Observable<SystemRole>{
    return this.http.put<SystemRole>(this.baseUrl + '/systemRoles/UpdateSystemRole', role)
  }

  getSystemRoleByUserId(userId:string):Observable<any>{
    return this.http.get<any>(this.baseUrl + '/systemRoles/GetSystemRoleByUserId/'+ userId)
  }

}
