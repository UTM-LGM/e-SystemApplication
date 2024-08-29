import { Component, OnInit } from '@angular/core';
import { SharedService } from '../_services/shared.service';
import { RegisterSystemRoleService } from '../_services/register-system-role.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  showUtility = false

  isRoleSystemAdmin = false;
  isRoleSystemOwner = false

  name = ''

  constructor(
    private sharedService:SharedService,
    private systemRoleService:RegisterSystemRoleService
  ){}

  ngOnInit(){
    this.name = this.sharedService.name
    this.isRoleSystemAdmin = this.sharedService.roles.includes('SystemAdmin')
    this.isRoleSystemOwner = this.sharedService.roles.includes('SystemOwner')
  }  
  
  toggleUtility() {
    this.showUtility = !this.showUtility
  }
}
