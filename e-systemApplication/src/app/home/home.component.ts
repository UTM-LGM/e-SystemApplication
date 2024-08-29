import { Component } from '@angular/core';
import { SharedService } from '../_services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(
    private sharedService:SharedService
  ){}

  ngOnInit(){
    // console.log(this.sharedService.roles)
  }
}
