import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  roles: string []=[]
  email= ''
  userId = ''
  systems: number[] = [];
  name = ''
}
