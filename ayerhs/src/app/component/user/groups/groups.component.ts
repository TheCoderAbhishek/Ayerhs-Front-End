import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoaderComponent } from '../../layout/loader/loader.component';
import { LoaderService } from '../../layout/loader/loader.service';
import { NavigationEnd, Router } from '@angular/router';
import { UserService } from '../user.service';
import { ExportService } from '../../../shared/exportService/export.service';
import { FormsModule } from '@angular/forms';
import { Subscription, partition } from 'rxjs';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, LoaderComponent, NgIf, NgFor, FormsModule],
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
})
export class GroupsComponent implements OnInit {
  private subscription: Subscription;
  isLoading = false;
  sortDirection: 'asc' | 'desc' = 'asc';
  currentSortField: 'groupName' | 'partitionName' = 'groupName';
  successMessage = '';
  errorMessage = '';
  groups: any[] = [];
  filteredGroups: any[] = [];
  isAddGroupConfirmationModalVisible = false;
  isUpdateGroupConfirmationModalVisible = false;
  isAddGroupModalVisible = false;
  isUpdateGroupModalVisible = false;
  newGroupName = '';
  partitionError: string | null = null;
  groupNameError: string | null = null;
  addGroupPartitions: any[] = [];
  changePartitionGroupPartitions: any[] = [];
  public selectedPartitionId: number | null = null;
  currentGroupIdToUpdate = 0;
  currentPartitionIdGroupPresent = 0;
  isSoftDeleteGroupVisible = false;
  currentGroupIdToSoftDeleteRecoverHardDelete = 0;
  isRecoverDeletedGroupVisible = false;
  isDeleteGroup = false;
  isChangePartitionGroupConfirmationModal = false;
  groupName: string | null = null;
  groupId = 0;
  partitionId = 0;
  isChangePartitionGroupModal = false;

  constructor(
    private loaderService: LoaderService,
    private router: Router,
    private userService: UserService,
    private exportService: ExportService
  ) {
    this.subscription = this.loaderService.isLoading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loaderService.setLoading(false);
      }
    });
  }

  ngOnInit(): void {
    this.fetchGroups();
  }

  fetchGroups(): void {
    if (typeof localStorage !== 'undefined') {
      this.loaderService.setLoading(true);
      this.userService.getGroups(0).subscribe(
        (response) => {
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
    const istOffset = 5.5 * 60 * 60 * 1000;
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

  showAddGroupConfirmationModal(): void {
    this.isAddGroupConfirmationModalVisible = true;
  }

  hideAddGroupConfirmationModal(): void {
    this.isAddGroupConfirmationModalVisible = false;
  }

  showAddGroupModal(): void {
    this.isAddGroupConfirmationModalVisible = false;
    this.loaderService.setLoading(true);
    this.userService.getPartitions().subscribe((response) => {
      if (response && response.returnValue) {
        this.addGroupPartitions = response.returnValue.$values;
      }
      this.loaderService.setLoading(false);
      this.isAddGroupModalVisible = true;
    });
  }

  hideAddGroupModal(): void {
    this.isAddGroupModalVisible = false;
    this.isAddGroupConfirmationModalVisible = false;
    this.groupNameError = null;
    this.partitionError = null;
    this.selectedPartitionId = null;
    this.newGroupName = '';
    this.router.navigate(['/user/groups']);
  }

  validatePartitionSelection(): void {
    if (!this.selectedPartitionId) {
      this.partitionError = 'Please select a partition.';
    } else {
      this.partitionError = null;
    }
  }

  validateGroupName(): void {
    const regex = /^[a-zA-Z0-9]+$/;
    if (!this.newGroupName) {
      this.groupNameError = 'Group Name cannot be empty';
    } else if (!regex.test(this.newGroupName)) {
      this.groupNameError =
        'Only contains letters and numbers. Special characters and spaces are not allowed';
    } else {
      this.groupNameError = null;
    }
  }

  addGroup() {
    this.validateGroupName();
    this.validatePartitionSelection();
    if (this.groupNameError === null && this.partitionError === null) {
      this.loaderService.setLoading(true);
      const inAddGroupDto = {
        partitionId: this.selectedPartitionId,
        groupName: this.newGroupName,
      };
      this.userService.addGroup(inAddGroupDto).subscribe(
        (response) => {
          this.hideAddGroupModal();
          this.loaderService.setLoading(false);
          this.fetchGroups();
          if (response.status === 'Success') {
            this.successMessage = response.successMessage;
          } else {
            this.errorMessage = response.errorMessage;
          }
        },
        (error) => {
          console.error('Error updating partition:', error);
          this.loaderService.setLoading(false);
        }
      );
      this.hideAddGroupModal();
    } else {
      console.error('Invalid Partition Name Selected or Group Name Provided.');
    }
  }

  showUpdateGroupConfirmationModal(
    groupId: number,
    partitionId: number,
    groupName: string
  ): void {
    this.currentGroupIdToUpdate = groupId;
    this.currentPartitionIdGroupPresent = partitionId;
    this.newGroupName = groupName;
    this.isUpdateGroupConfirmationModalVisible = true;
  }

  hideUpdateGroupConfirmationModal(): void {
    this.isUpdateGroupConfirmationModalVisible = false;
  }

  showUpdateGroupModal(): void {
    this.isUpdateGroupModalVisible = true;
  }

  hideUpdateGroupModal(): void {
    this.isUpdateGroupModalVisible = false;
    this.isUpdateGroupConfirmationModalVisible = false;
    this.groupNameError = '';
  }

  updateGroup() {
    this.validateGroupName();
    if (this.groupNameError === null) {
      const updateGroup = {
        id: this.currentGroupIdToUpdate,
        partitionId: this.currentPartitionIdGroupPresent,
        newGroupName: this.newGroupName,
      };
      this.loaderService.setLoading(true);

      this.userService.updateGroup(updateGroup).subscribe(
        (response) => {
          this.hideUpdateGroupModal();
          this.loaderService.setLoading(false);
          this.fetchGroups();
          if (response.status === 'Success') {
            this.successMessage = response.successMessage;
          } else {
            this.errorMessage = response.errorMessage;
          }
        },
        (error) => {
          console.error('Error updating group:', error);
          this.loaderService.setLoading(false);
        }
      );
    } else {
      console.error('Invalid Group Name Provided.');
    }
  }

  showSoftDeleteGroupConfirmationModal(groupId: number) {
    this.currentGroupIdToSoftDeleteRecoverHardDelete = groupId;
    this.isSoftDeleteGroupVisible = true;
  }

  hideSoftDeleteGroupConfirmationModal() {
    this.currentGroupIdToSoftDeleteRecoverHardDelete = 0;
    this.isSoftDeleteGroupVisible = false;
  }

  softDeleteGroup(groupId: number): void {
    this.loaderService.setLoading(true);
    this.userService.softDeleteGroup(groupId).subscribe(
      (response) => {
        this.loaderService.setLoading(false);
        this.fetchGroups();
        if (response.status === 'Success') {
          this.successMessage = response.successMessage;
        } else {
          this.errorMessage = response.errorMessage;
        }
        this.hideSoftDeleteGroupConfirmationModal();
      },
      (error) => {
        console.error('Error deleting partition:', error);
        this.loaderService.setLoading(false);
      }
    );
  }

  showRecoverGroupConfirmationModal(groupId: number) {
    this.currentGroupIdToSoftDeleteRecoverHardDelete = groupId;
    this.isRecoverDeletedGroupVisible = true;
  }

  hideRecoverGroupConfirmationModal() {
    this.currentGroupIdToSoftDeleteRecoverHardDelete = 0;
    this.isRecoverDeletedGroupVisible = false;
  }

  recoverDeletedGroup(groupId: number): void {
    this.loaderService.setLoading(true);
    this.userService.restoreDeletedGroup(groupId).subscribe(
      (response) => {
        this.loaderService.setLoading(false);
        this.fetchGroups();
        if (response.status === 'Success') {
          this.successMessage = response.successMessage;
        } else {
          this.errorMessage = response.errorMessage;
        }
        this.hideRecoverGroupConfirmationModal();
      },
      (error) => {
        console.error('Error deleting partition:', error);
        this.loaderService.setLoading(false);
      }
    );
  }

  showDeleteGroupConfirmationModal(groupId: number) {
    this.currentGroupIdToSoftDeleteRecoverHardDelete = groupId;
    this.isDeleteGroup = true;
  }

  hideDeleteGroupConfirmationModal() {
    this.currentGroupIdToSoftDeleteRecoverHardDelete = 0;
    this.isDeleteGroup = false;
  }

  deleteGroup(groupId: number): void {
    this.loaderService.setLoading(true);
    this.userService.deleteGroup(groupId).subscribe(
      (response) => {
        this.loaderService.setLoading(false);
        this.fetchGroups();
        if (response.status === 'Success') {
          this.successMessage = response.successMessage;
        } else {
          this.errorMessage = response.errorMessage;
        }
        this.hideDeleteGroupConfirmationModal();
      },
      (error) => {
        console.error('Error deleting partition:', error);
        this.loaderService.setLoading(false);
      }
    );
  }

  showChangePartitionGroupConfirmationModal(groupId: number, partitionId: number, groupName: string){
    this.groupName = groupName;
    this.groupId = groupId;
    this.partitionId = partitionId;
    this.isChangePartitionGroupConfirmationModal = true;
  }

  hideChangePartitionGroupConfirmationModal(){
    this.isChangePartitionGroupConfirmationModal = false;
  }

  showChangePartitionGroupModal(){
    this.isChangePartitionGroupModal = true;
    this.userService.getPartitions().subscribe((response) => {
      if (response && response.returnValue) {
        this.changePartitionGroupPartitions = response.returnValue.$values;
      }
      this.loaderService.setLoading(false);
    });
  }

  hideChangePartitionGroupModal(){
    this.isChangePartitionGroupModal = false;
    this.isChangePartitionGroupConfirmationModal = false;
    this.partitionError = '';
    this.selectedPartitionId = null;
  }

  changePartitionGroup() {
    this.validatePartitionSelection();
    if (this.partitionError === null) {
      this.loaderService.setLoading(true);
      const inChangePartitionGroupDto = {
        partitionId: this.selectedPartitionId,
        groupId: this.groupId,
      };
      this.userService.changePartitionGroup(inChangePartitionGroupDto).subscribe(
        (response) => {
          this.hideChangePartitionGroupModal();
          this.loaderService.setLoading(false);
          this.fetchGroups();
          if (response.status === 'Success') {
            this.successMessage = response.successMessage;
          } else {
            this.errorMessage = response.errorMessage;
          }
        },
        (error) => {
          console.error('Error changing partition:', error);
          this.loaderService.setLoading(false);
        }
      );
      this.hideChangePartitionGroupModal();
    } else {
      console.error('Invalid Partition Name Selected or Group Name Provided.');
    }
  }

  exportPDF() {
    const headers = [
      'Sr No',
      'Group Name',
      'Partition Name',
      'Created On',
      'Updated On',
    ];
    const data = this.groups.map((group, index) => [
      index + 1,
      group.groupName,
      group.partition.partitionName,
      new Date(group.groupCreatedOn).toLocaleString(),
      new Date(group.groupUpdatedOn).toLocaleString(),
    ]);
    this.exportService.exportToPDF(headers, data, 'Groups');
  }

  exportExcel() {
    const headers = [
      'Sr No',
      'Group Name',
      'Partition Name',
      'Created On',
      'Updated On',
    ];
    const data = this.groups.map((group, index) => [
      index + 1,
      group.groupName,
      group.partition.partitionName,
      new Date(group.groupCreatedOn).toLocaleString(),
      new Date(group.groupUpdatedOn).toLocaleString(),
    ]);
    this.exportService.exportToExcel(headers, data, 'Groups');
  }

  toggleSortDirection(field: 'groupName' | 'partitionName'): void {
    if (this.currentSortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSortField = field;
      this.sortDirection = 'asc';
    }
    this.sortGroups();
  }

  sortGroups(): void {
    this.filteredGroups.sort((a, b) => {
      let aField, bField;
      if (this.currentSortField === 'groupName') {
        aField = a.groupName;
        bField = b.groupName;
      } else {
        aField = a.partition.partitionName;
        bField = b.partition.partitionName;
      }
      if (this.sortDirection === 'asc') {
        return aField.localeCompare(bField);
      } else {
        return bField.localeCompare(aField);
      }
    });
  }
}
