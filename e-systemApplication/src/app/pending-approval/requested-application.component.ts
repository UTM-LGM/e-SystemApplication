import { Component, OnInit } from '@angular/core';
import { RegisterSystemService } from '../_services/register-system.service';
import { RegisterSystemRoleService } from '../_services/register-system-role.service';
import { SubscriptionService } from '../_services/subscription.service';
import { EmployeesService } from '../_services/employees.service';
import { NewApplicationService } from '../_services/new-application.service';
import { System } from '../_interface/system';
import { SystemRole } from '../_interface/systemRole';
import swal from 'sweetalert2';
import { EmailService } from '../_services/email.service';
import { SharedService } from '../_services/shared.service';

@Component({
  selector: 'app-requested-application',
  templateUrl: './requested-application.component.html',
  styleUrls: ['./requested-application.component.css']
})
export class RequestedApplicationComponent implements OnInit {

  order = ''
  currentSortedColumn = ''
  isLoading = true
  divisions: any[] = []
  systems: System[] = []
  units: any[] = []
  systemRoles: SystemRole[] = []
  applications: any[] = []

  itemPerPage = 10
  pageNumber = 1



  sortableColumns = [
    { columnName: 'date', displayText: 'Date Applied' },
    { columnName: 'userDept', displayText: 'User Department' },
    { columnName: 'userUnit', displayText: 'User Unit' },
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
    private sharedService: SharedService
  ) { }

  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
  }

  ngOnInit(): void {
    this.getDivision()
    this.getSystem()
    this.getUnit()
    this.getSystemRole()
    this.getApplication()
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

  getSystem() {
    const getSystem = this.systemService.getSystems()
      .subscribe(
        Response => {
          this.systems = Response.filter(s => s.isActive == true)
        }
      )
    this.subscriptionService.add(getSystem)
  }

  getUnit() {
    const getUnit = this.employeeService.getEmployeeUnit()
      .subscribe(
        Response => {
          this.units = Response
        }
      )
  }

  getSystemRole() {
    const getSystemRole = this.systemRoleService.getSystemRoles()
      .subscribe(
        Response => {
          this.systemRoles = Response
        }
      )
    this.subscriptionService.add(getSystemRole)
  }

  getApplication() {
    this.applicationService.getApplication()
      .subscribe(
        Response => {
          this.applications = Response.filter(
            x => x.status === "New" && x.systemId !== null && this.sharedService.systems.includes(x.systemId)
          );

          this.employeeService.getEmployeeDivision().subscribe((divisions) => {
            // Assign division names to each system owner
            this.applications.forEach((user: any) => {
              user.divisionName = divisions.find((d: any) => d.div_id === user.divId)?.div_name;
            })

            this.employeeService.getEmployeeUnit().subscribe((unit) => {
              this.applications.forEach((user: any) => {
                user.unitName = unit.find((u: any) => u.unit_id === user.unitId)?.unit_name
              })
            })

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
          })
        })
  }

  approved() {
    const approvalId = this.sharedService.userId
    const status = "Approved"
    const selectedApplications = this.applications
      .filter(app => app.isSelected)
      .map(app => ({
        ...app,
        approvalId: approvalId,
        status: status
      }))
    if (selectedApplications.length == 0) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select the list',
      });
    } else {
      this.applicationService.approvedApplication(selectedApplications)
        .subscribe(
          Response => {
            this.emailService.sendAssignEmail(0)
              .subscribe(
                Response => {
                  swal.fire({
                    title: 'Done!',
                    text: 'Application successfully approved!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1000
                  });
                  this.ngOnInit()
                }
              )

          }
        )
    }
  }

  reject() {
    const approvalId = this.sharedService.userId
    const status = "Rejected"
    const selectedApplications = this.applications
      .filter(app => app.isSelected)
      .map(app => ({
        ...app,
        approvalId: approvalId,
        status: status
      }))
    if (selectedApplications.length == 0) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select the list',
      });
    } else {
      this.applicationService.rejectApplication(selectedApplications)
        .subscribe(
          Response => {
            swal.fire({
              title: 'Done!',
              text: 'Application successfully Rejected!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.ngOnInit()
          }
        )
    }
  }

}
