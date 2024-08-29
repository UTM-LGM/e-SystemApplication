import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { System } from '../_interface/system';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterSystemService {

  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getSystems():Observable<System[]>{
    return this.http.get<System[]>(this.baseUrl + '/systems/GetSystems')
  }

  addSystem(system:System):Observable<System>{
    return this.http.post<System>(this.baseUrl + '/systems/AddSystem', system)
  }

  updateSystem(system:System):Observable<System>{
    return this.http.put<System>(this.baseUrl + '/systems/UpdateSystem', system)
  }

}
