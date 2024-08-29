import { Component, OnDestroy, OnInit } from '@angular/core';
import { System } from 'src/app/_interface/system';
import { RegisterSystemService } from 'src/app/_services/register-system.service';
import { SharedService } from 'src/app/_services/shared.service';
import { SubscriptionService } from 'src/app/_services/subscription.service';
import swal from 'sweetalert2';


@Component({
  selector: 'app-register-system',
  templateUrl: './register-system.component.html',
  styleUrls: ['./register-system.component.css']
})
export class RegisterSystemComponent implements OnInit, OnDestroy {

  term = ''
  order = ''
  currentSortedColumn = ''
  isLoading = true
  pageNumber = 1
  isSubmit = false
  itemPerPage = 10

  system: System = {} as System
  systems: System[] = []

  sortableColumns = [
    { columnName: 'systemName', displayText: 'System Name' },
  ];

  constructor(
    private systemService: RegisterSystemService,
    private subscriptionService: SubscriptionService,
    private sharedService:SharedService

  ) { }

  ngOnInit(): void {
    this.getSystem()
  }

  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
  }

  onSubmit() {
    if (this.system.systemName == null) {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill up system name',
      });
    } else if (this.systems.some(s => s.systemName === this.system.systemName)) {
      swal.fire({
        text: 'System already exists!',
        icon: 'error'
      });
    } else {
      this.isSubmit = true
      this.system.isActive = true
      this.system.createdBy = this.sharedService.userId.toString()
      this.systemService.addSystem(this.system)
        .subscribe(
          Response => {
            swal.fire({
              title: 'Done!',
              text: 'System successfully added!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.system.systemName = ''
            this.isSubmit = false
            this.ngOnInit()
          }
        )
    }
  }

  getSystem() {
    setTimeout(() => {
      const getSystem = this.systemService.getSystems()
        .subscribe(
          Response => {
            this.systems = Response
            this.isLoading = false
          }
        )
      this.subscriptionService.add(getSystem)
    }, 2000)
  }

  status(system: System) {
    system.updatedBy = this.sharedService.userId
    system.isActive = !system.isActive
    this.systemService.updateSystem(system)
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

}
