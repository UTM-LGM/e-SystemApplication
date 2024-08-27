import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NewApplication } from '../_interface/newApplication';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewApplicationService {

  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  addApplication(application:NewApplication):Observable<NewApplication>{
    return this.http.post<NewApplication>(this.baseUrl + '/applications/AddApplication', application)
  }

  getApplication():Observable<NewApplication[]>{
    return this.http.get<NewApplication[]>(this.baseUrl + '/applications/GetApplication')
  }

  approvedApplication(applications:NewApplication[]){
    return this.http.put(this.baseUrl + '/applications/ApprovedApplication', applications)
  }

  assignedApplication(applications:NewApplication[]){
    return this.http.put(this.baseUrl + '/applications/AssignedApplication', applications)
  }

}
