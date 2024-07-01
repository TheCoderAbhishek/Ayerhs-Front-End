import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoaderComponent } from '../../layout/loader/loader.component';
import { LoaderService } from '../../layout/loader/loader.service';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { ExportService } from '../../../shared/exportService/export.service';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, LoaderComponent, NgIf, NgFor],
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
})
export class GroupsComponent implements OnInit {
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  groups: any[] = [];
  filteredGroups: any[] = [];

  constructor(
    private loaderService: LoaderService,
    private router: Router,
    private userService: UserService,
    private exportService: ExportService
  ) {}

  ngOnInit(): void {
    this.fetchGroups();
  }

  fetchGroups(): void {
    if (typeof localStorage !== 'undefined') {
      this.loaderService.setLoading(true);
      this.userService.getGroups(0).subscribe(
        (response) => {
          console.log(response);
          if (response && response.returnValue) {
            this.groups = response.returnValue.$values;
            this.filteredGroups = [...this.groups];
            this.convertUTCToIST();
          } else {
            console.error('Invalid response structure', response);
          }
          this.loaderService.setLoading(false);
        },
        (error) => {
          console.error('Error fetching partitions data', error);
          this.loaderService.setLoading(false);
        }
      );
    } else {
      this.loaderService.setLoading(false);
    }
  }

  convertUTCToIST(): void {
    this.groups.forEach((group) => {
      group.groupCreatedOn = this.convertToISTString(
        new Date(group.groupCreatedOn)
      );
      group.groupUpdatedOn = this.convertToISTString(
        new Date(group.groupUpdatedOn)
      );
      if (group.partition) {
        group.partition.partitionCreatedOn = this.convertToISTString(
          new Date(group.partition.partitionCreatedOn)
        );
        group.partition.partitionUpdatedOn = this.convertToISTString(
          new Date(group.partition.partitionUpdatedOn)
        );
      }
    });
  }

  convertToISTString(date: Date): string {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST offset UTC+5.5
    const istDate = new Date(date.getTime() + istOffset);
    return istDate.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
    });
  }

  filterGroups(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredGroups = this.groups.filter((group) =>
      group.groupName.toLowerCase().includes(searchTerm)
    );
  }

  hideAlert() {
    this.successMessage = '';
    this.errorMessage = '';
  }

  addPartition() {
    // Implement add partition logic here
  }

  editPartition(id: number) {
    // Implement edit partition logic here
  }

  deletePartition(id: number) {
    // Implement delete partition logic here
  }

  exportPDF() {
    // Implement export PDF logic here
  }

  exportExcel() {
    // Implement export Excel logic here
  }
}
