import { Component, OnInit } from '@angular/core';
import { RegisterSystemService } from '../_services/register-system.service';
import { RegisterSystemRoleService } from '../_services/register-system-role.service';
import { SubscriptionService } from '../_services/subscription.service';
import { SystemRole } from '../_interface/systemRole';
import { System } from '../_interface/system';
import { NewApplication } from '../_interface/newApplication';
import { EmployeesService } from '../_services/employees.service';
import { NewApplicationService } from '../_services/new-application.service';
import swal from 'sweetalert2';
import { EmailService } from '../_services/email.service';
import { SharedService } from '../_services/shared.service';


@Component({
  selector: 'app-new-request-application',
  templateUrl: './new-request-application.component.html',
  styleUrls: ['./new-request-application.component.css']
})
export class NewRequestApplicationComponent implements OnInit {

  systemRoles: SystemRole[] = []
  systems: System[] = []
  application = {} as NewApplication
  applications: any[] = []
  isSystem = true
  order = ''
  currentSortedColumn = ''
  isLoading = true
  divisions: any[] = []
  unitByDivision: any[] = []
  employeeByUnit: any[] = []
  units: any[] = []
  currentDate = ''
  itemPerPage = 10
  pageNumber = 1

  sortableColumns = [
    { columnName: 'userName', displayText: 'User Full Name' },
    { columnName: 'requestApplication', displayText: 'Request System' },
    { columnName: 'requestRole', displayText: 'Request Role' },
  ];

  constructor(
    private systemService: RegisterSystemService,
    private systemRoleService: RegisterSystemRoleService,
    private subscriptionService: SubscriptionService,
    private employeeService: EmployeesService,
    private applicationService: NewApplicationService,
    private emailService: EmailService,
    private sharedService:SharedService
  ) { }

  ngOnInit(): void {
    this.currentDate = new Date().toISOString().substring(0, 10)
    if (this.currentDate) {
      this.application.dateApplied = new Date(this.currentDate)
    }
    this.getDivision()
    this.getSystem()
    this.getApplication()
  }

  selectedDate(date: string) {
    if (date) {
      this.application.dateApplied = new Date(date)
    }
  }

  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
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

  getSystemRole() {
    this.application.systemRoleId = null
    const getSystemRole = this.systemRoleService.getSystemRoles()
      .subscribe(
        Response => {
          this.systemRoles = Response.filter(s => s.isActive == true && s.systemId == this.application.systemId)
        }
      )
    this.subscriptionService.add(getSystemRole)
  }

  getDivision() {
    const getDivision = this.employeeService.getEmployeeDivision()
      .subscribe(
        Response => {
          this.divisions = Response
        }
      )
    this.subscriptionService.add(getDivision)

  }

  getUnitByDivision() {
    const getUnit = this.employeeService.getEmployeeUnit()
      .subscribe(
        Response => {
          this.unitByDivision = Response.filter(u => u.div_id == this.application.divId)
        }
      )
    this.subscriptionService.add(getUnit)
  }

  getEmployeesByUnit() {
    const getEmployee = this.employeeService.getEmployees()
      .subscribe(
        Response => {
          this.employeeByUnit = Response.filter(e => e.unit_id == this.application.unitId)
        }
      )
    this.subscriptionService.add(getEmployee)

  }

  submit() {
    this.application.createdBy = this.sharedService.userId.toString()
    this.application.status = 'New'
    if (this.application.systemRoleId == null) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill up the form',
      });
    } else {
      this.applicationService.addApplication(this.application)
        .subscribe(
          Response => {
            if (Response.systemId != null) {
              this.emailService.sendApprovalEmail(Response.systemId)
                .subscribe(
                  Response => {
                    swal.fire({
                      title: 'Done!',
                      text: 'Application successfully submitted!',
                      icon: 'success',
                      showConfirmButton: false,
                      timer: 1000
                    });
                  }
                )
            }
            this.application.divId = null
            this.application.unitId = null
            this.application.userId = null
            this.application.systemId = null
            this.application.systemRoleId = null
            this.ngOnInit()
          }
        )
    }

  }

  getApplication() {
    this.applicationService.getApplication()
      .subscribe(
        Response => {
          this.applications = Response.filter(x=>x.createdBy == this.sharedService.userId && x.status != 'Cancel')

          this.employeeService.getEmployees().subscribe((employee) => {
            this.applications.forEach((user: any) => {
              user.employeeName = employee.find((e: any) => e.emp_id === user.userId)?.emp_name
            })
          })

          this.systemService.getSystems().subscribe((system) => {
            this.applications.forEach((user: any) => {
              user.systemName = system.find((s: any) => s.id === user.systemId)?.systemName
            })
          })

          this.systemRoleService.getSystemRoles().subscribe((role) => {
            this.applications.forEach((user: any) => {
              user.roleName = role.find((r: any) => r.id === user.systemRoleId)?.roleName
            })
          })

          this.isLoading = false
        }
      )
  }

  setEmail(selectedId:number){
    const selectedEmployee = this.employeeByUnit.find(employee => employee.emp_id === selectedId);

    if (selectedEmployee) {
      // Set the employee email in systemOwner
      this.application.userEmail = selectedEmployee.emp_email_login;
    }
  }

  cancel(id:number){
    this.applicationService.changeStatus(id)
    .subscribe(
      Response =>{
        swal.fire({
          title: 'Done!',
          text: 'Application successfully cancel!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        });
        this.ngOnInit()
      }
    )

  }


}
