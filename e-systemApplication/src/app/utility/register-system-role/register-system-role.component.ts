import { Component, OnInit } from '@angular/core';
import { System } from 'src/app/_interface/system';
import { SystemRole } from 'src/app/_interface/systemRole';
import { RegisterSystemRoleService } from 'src/app/_services/register-system-role.service';
import { RegisterSystemService } from 'src/app/_services/register-system.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import swal from 'sweetalert2';


@Component({
  selector: 'app-register-system-role',
  templateUrl: './register-system-role.component.html',
  styleUrls: ['./register-system-role.component.css']
})
export class RegisterSystemRoleComponent implements OnInit {

  systemRole = {} as SystemRole
  systemRoles:SystemRole[]=[]
  systems: System[] = []
  order = ''
  currentSortedColumn = ''
  isLoading = true
  pageNumber = 1
  isSubmit = false
  itemPerPage= 10

  sortableColumns = [
    { columnName: 'systemName', displayText: 'System Name' },
    { columnName: 'roleName', displayText: 'Role Name' },
  ];

  constructor(
    private systemService: RegisterSystemService,
    private systemRoleService:RegisterSystemRoleService,
    private subscriptionService: SubscriptionService,
    private sharedService:SharedService
  ) { }

  ngOnInit(): void {
    this.getSystem()
    this.getSystemRole()
  }

  getSystem() {
    const getSystem = this.systemService.getSystems()
      .subscribe(
        Response => {
          this.systems = Response.filter(s => s.isActive == true)
        }
      )
      this.subscriptionService.add(getSystem)
  }

  getSystemRole(){
    const getSystemRole = this.systemRoleService.getSystemRoles()
    .subscribe(
      Response =>{
        this.systemRoles = Response
        this.isLoading = false
      }
    )
    this.subscriptionService.add(getSystemRole)
  }

  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
  }

  submit() {
    if (this.systemRole.roleName == null || this.systemRole.systemId == null) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill up the form',
      });
    } else if(this.systemRoles.some(s=>s.roleName === this.systemRole.roleName && s.systemId === this.systemRole.systemId)){
      swal.fire({
        text: 'Role already exists!',
        icon: 'error'
      });
    } else {
      this.isSubmit = true
      this.systemRole.createdBy = this.sharedService.userId.toString()
      this.systemRole.isActive = true
      this.systemRoleService.addSystemRole(this.systemRole)
      .subscribe(
        Response =>{
          swal.fire({
            title: 'Done!',
            text: 'System role successfully added!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.systemRole.systemId = 0
          this.systemRole.roleName = ''
          this.isSubmit = false
          this.ngOnInit()
        }
      )
    }
  }

  status(role:SystemRole){
    role.updatedBy = this.sharedService.userId
    role.isActive = !role.isActive
    this.systemRoleService.updateSystemRole(role)
    .subscribe(
      Response =>{
        swal.fire({
          title: 'Done!',
          text: 'Status successfully updated!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        });
        this.ngOnInit()
      }
    )
  }





}
