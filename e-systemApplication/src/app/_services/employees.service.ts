import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { eCutiEnv, environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  baseUrl = eCutiEnv.apiUrl
  // baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getEmployeeDivision():Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl + '/Applications/GetEmployeeDivision')

  }

  getEmployeeUnit():Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl + '/Applications/GetEmployeeUnit')
  }

  getEmployees():Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl + '/Applications/GetEmployees')
  }

  getEmplyeesByEmail(email:string):Observable<any>{
    return this.http.get<any>(this.baseUrl + '/applications/GetEmployeesDetail/' + email)
  }
}
