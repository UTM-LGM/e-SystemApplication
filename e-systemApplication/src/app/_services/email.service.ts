import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }
  
  sendApprovalEmail(systemId:number):Observable<number>{
    return this.http.post<number>(this.baseUrl + '/emails/SendApprovalEmail', systemId)
  }

  sendAssignEmail(systemId:number):Observable<void>{
    return this.http.post<void>(this.baseUrl + '/emails/SendAssignEmail', systemId)
  }

}
