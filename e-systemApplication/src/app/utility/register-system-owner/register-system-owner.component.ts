import { Component, OnDestroy, OnInit } from '@angular/core';
import { System } from 'src/app/_interface/system';
import { SystemOwner } from 'src/app/_interface/systemOwner';
import { EmployeesService } from 'src/app/_services/employees.service';
import { RegisterSystemOwnerService } from 'src/app/_services/register-system-owner.service';
import { RegisterSystemService } from 'src/app/_services/register-system.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-register-system-owner',
  templateUrl: './register-system-owner.component.html',
  styleUrls: ['./register-system-owner.component.css']
})
export class RegisterSystemOwnerComponent implements OnInit, OnDestroy {

  systems: System[] = []
  systemOwners: any[] = []
  divisions: any[] = []
  units: any[] = []
  unitByDivision: any[] = []
  employeeByUnit: any[] = []
  employees: any[] = []
  isSubmit = false
  order = ''

  systemOwner = {} as SystemOwner
  currentSortedColumn = ''
  itemPerPage = 10
  pageNumber = 1
  department: any = {} as any
  isLoading = true

  sortableColumns = [
    { columnName: 'systemName', displayText: 'System Name' },
    { columnName: 'departmenName', displayText: 'Department Name' },
    { columnName: 'unitName', displayText: 'Unit Name' },
    { columnName: 'employeeName', displayText: 'Owner Name' },
  ];

  constructor(
    private systemService: RegisterSystemService,
    private subscriptionService: SubscriptionService,
    private employeeService: EmployeesService,
    private systemOwnerService: RegisterSystemOwnerService,
    private sharedService:SharedService
  ) { }

  ngOnInit(): void {
    this.getSystem()
    this.getDivision()
    this.getSystemOwner()
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
          this.unitByDivision = Response.filter(u => u.div_id == this.systemOwner.divId)
        }
      )
    this.subscriptionService.add(getUnit)
  }

  getUnit() {
    const getUnit = this.employeeService.getEmployeeUnit()
      .subscribe(
        Response => {
          this.units = Response
        }
      )
    this.subscriptionService.add(getUnit)
  }

  getEmployeesByUnit() {
    const getEmployee = this.employeeService.getEmployees()
      .subscribe(
        Response => {
          this.employeeByUnit = Response.filter(e => e.unit_id == this.systemOwner.unitId)
        }
      )
    this.subscriptionService.add(getEmployee)

  }

  getEmployees() {
    const getEmployee = this.employeeService.getEmployees()
      .subscribe(
        Response => {
          this.employees = Response
        }
      )
    this.subscriptionService.add(getEmployee)
  }

  submit() {
    if (this.systemOwner.systemId == null || this.systemOwner.divId == null || this.systemOwner.unitId == null || this.systemOwner.userId == null) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill up the form',
      });
    } else {
      this.isSubmit = true
      this.systemOwner.isActive = true
      this.systemOwner.role = 'SystemOwner'
      this.systemOwner.createdBy = this.sharedService.userId
      this.systemOwnerService.addSystemOwner(this.systemOwner)
        .subscribe(
          Response => {
            swal.fire({
              title: 'Done!',
              text: 'System successfully added!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.systemOwner.systemId = null
            this.systemOwner.divId = null
            this.systemOwner.unitId = null
            this.systemOwner.userId = null
            this.isSubmit = false
            this.ngOnInit()
          }
        )
    }
  }

  getSystemOwner() {
    this.getDivision()
    this.getEmployees()
    this.getUnit()
    this.systemOwnerService.getSystemOwners()
      .subscribe(
        Response => {
          this.systemOwners = Response

          this.systemService.getSystems().subscribe((system) => {
            this.systemOwners.forEach((user: any) => {
              user.systemName = system.find((s: any) => s.id === user.systemId)?.systemName
            })
          })

          // Fetch all divisions once
          this.employeeService.getEmployeeDivision().subscribe((divisions) => {
            // Assign division names to each system owner
            this.systemOwners.forEach((user: any) => {
              user.divisionName = divisions.find((d: any) => d.div_id === user.divId)?.div_name;
            });

            this.employeeService.getEmployeeUnit().subscribe((unit) => {
              this.systemOwners.forEach((user: any) => {
                user.unitName = unit.find((u: any) => u.unit_id === user.unitId)?.unit_name
              })
            })

            this.employeeService.getEmployees().subscribe((employee) => {
              this.systemOwners.forEach((user: any) => {
                user.employeeName = employee.find((e: any) => e.emp_id === user.userId)?.emp_name
              })
            })

            this.isLoading = false
          })
        },
        error => {
          console.error('Error fetching system owners:', error);
        }
      )
  }

  status(owner: SystemOwner) {
    owner.updatedBy = this.sharedService.userId
    owner.isActive = !owner.isActive
    this.systemOwnerService.updateSystemOwner(owner)
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

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeAll();
  }

  setEmail(selectedId:number){
    const selectedEmployee = this.employeeByUnit.find(employee => employee.emp_id === selectedId);

    if (selectedEmployee) {
      // Set the employee email in systemOwner
      this.systemOwner.email = selectedEmployee.emp_email_login;
    }
  }


}
