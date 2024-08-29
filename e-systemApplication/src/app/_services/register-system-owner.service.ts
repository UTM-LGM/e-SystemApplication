import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SystemOwner } from '../_interface/systemOwner';

@Injectable({
  providedIn: 'root'
})
export class RegisterSystemOwnerService {

  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getSystemOwners():Observable<SystemOwner[]>{
    return this.http.get<SystemOwner[]>(this.baseUrl + '/systemOwners/GetSystemOwners')
  }

  addSystemOwner(owner:SystemOwner):Observable<SystemOwner>{
    return this.http.post<SystemOwner>(this.baseUrl + '/systemOwners/AddSystemOwner', owner)
  }

  updateSystemOwner(owner:SystemOwner):Observable<SystemOwner>{
    return this.http.put<SystemOwner>(this.baseUrl + '/systemOwners/UpdateSystemOwner', owner)
  }


}
