import { Component } from '@angular/core';
import { System } from '../_interface/system';
import { SystemRole } from '../_interface/systemRole';
import { RegisterSystemService } from '../_services/register-system.service';
import { RegisterSystemRoleService } from '../_services/register-system-role.service';
import { SubscriptionService } from '../_services/subscription.service';
import { EmployeesService } from '../_services/employees.service';
import { NewApplicationService } from '../_services/new-application.service';
import { EmailService } from '../_services/email.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-approved-application',
  templateUrl: './approved-application.component.html',
  styleUrls: ['./approved-application.component.css']
})
export class ApprovedApplicationComponent {
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
    private emailService: EmailService
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
          this.applications = Response.filter(x => x.status == "Approved")

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

  assign() {
    const assignBy = ''
    const status = "Assigned"
    const selectedApplications = this.applications
      .filter(app => app.isSelected)
      .map(app => ({
        ...app,
        assignBy: assignBy,
        status: status
      }));
    if (selectedApplications.length == 0) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select the list',
      });
    }
    else {
      this.applicationService.assignedApplication(selectedApplications)
        .subscribe(
          Response => {
            swal.fire({
              title: 'Done!',
              text: 'System successfully assigned!',
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
