import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { LoaderComponent } from '../../layout/loader/loader.component';
import { LoaderService } from '../../layout/loader/loader.service';
import {
  Observable,
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
} from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms';
import { ExportService } from '../../../shared/exportService/export.service';

@Component({
  selector: 'app-partitions',
  standalone: true,
  imports: [NgIf, NgFor, LoaderComponent, CommonModule, FormsModule],
  templateUrl: './partitions.component.html',
  styleUrls: ['./partitions.component.css'],
})
export class PartitionsComponent {
  successMessage = '';
  errorMessage = '';
  partitions: any[] = [];
  filteredPartitions: any[] = [];
  isLoading = false;
  private subscription: Subscription;
  sortDirection: 'asc' | 'desc' = 'asc';
  private searchTerms = new Subject<string>();
  isConfirmationModalVisible = false;
  isAddPartitionModalVisible = false;
  newPartitionName = '';
  partitionNameError: string | null = null;
  isDeletePartitionVisible = false;
  currentPartitionIdToDelete = 0;
  isUpdatePartitionModalVisible = false;

  constructor(
    private http: HttpClient,
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
    this.fetchPartitions();
    this.setupSearchSubscription();
  }

  fetchPartitions(): void {
    if (typeof localStorage !== 'undefined') {
      this.loaderService.setLoading(true);
      const token = localStorage.getItem('authToken');
      this.userService.getPartitions().subscribe(
        (response) => {
          if (response && response.returnValue) {
            this.partitions = response.returnValue;
            this.filteredPartitions = [...this.partitions];
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

  exportPDF(): void {
    const headers = ['Sr No', 'Partition Name', 'Created On', 'Updated On'];
    const data = this.partitions.map((partition, index) => [
      index + 1,
      partition.partitionName,
      new Date(partition.partitionCreatedOn).toLocaleString(),
      new Date(partition.partitionUpdatedOn).toLocaleString(),
    ]);
    this.exportService.exportToPDF(headers, data, 'Partitions');
  }

  exportExcel(): void {
    const headers = ['Sr No', 'Partition Name', 'Created On', 'Updated On'];
    const data = this.partitions.map((partition, index) => [
      index + 1,
      partition.partitionName,
      new Date(partition.partitionCreatedOn).toLocaleString(),
      new Date(partition.partitionUpdatedOn).toLocaleString(),
    ]);
    this.exportService.exportToExcel(headers, data, 'Partitions');
  }

  private setupSearchSubscription(): void {
    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) => {
          this.loaderService.setLoading(true);
          return this.filterPartitions(term);
        })
      )
      .subscribe((filteredPartitions) => {
        this.filteredPartitions = filteredPartitions;
        this.loaderService.setLoading(false);
      });
  }

  // Handle input change event and push search term to the observable stream
  onSearchInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchTerm = inputElement.value.trim().toLowerCase();

    if (searchTerm !== '') {
      this.searchTerms.next(searchTerm);
    } else {
      this.filteredPartitions = [...this.partitions];
    }
  }

  // Filter partitions based on search term
  private filterPartitions(term: string): Observable<any[]> {
    return of(
      this.partitions.filter((partition) =>
        partition.partitionName.toLowerCase().includes(term)
      )
    );
  }

  sortPartitions(): void {
    this.filteredPartitions.sort((a, b) => {
      if (this.sortDirection === 'asc') {
        return a.partitionName.localeCompare(b.partitionName);
      } else {
        return b.partitionName.localeCompare(a.partitionName);
      }
    });
  }

  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortPartitions();
  }

  convertUTCToIST(): void {
    this.partitions.forEach((partition) => {
      const utcDate = new Date(partition.partitionCreatedOn);
      partition.partitionCreatedOn = this.convertToISTString(utcDate);

      const utcUpdateDate = new Date(partition.partitionUpdatedOn);
      partition.partitionUpdatedOn = this.convertToISTString(utcUpdateDate);
    });
  }

  convertToISTString(utcDate: Date): string {
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(utcDate.getTime() + istOffset);
    return istDate.toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
    });
  }

  showConfirmationModal(): void {
    this.isConfirmationModalVisible = true;
  }

  hideConfirmationModal(): void {
    this.isConfirmationModalVisible = false;
  }

  showAddPartitionModal(): void {
    this.isAddPartitionModalVisible = true;
    this.newPartitionName = '';
    this.partitionNameError = null;
  }

  hideAddPartitionModal(): void {
    this.isAddPartitionModalVisible = false;
    this.isConfirmationModalVisible = false;
    this.partitionNameError = null;
    this.router.navigate(['/user/partitions']);
  }

  validatePartitionName(): void {
    const regex = /^[a-zA-Z0-9]+$/;
    if (!this.newPartitionName) {
      this.partitionNameError = 'Partition Name cannot be empty';
    } else if (!regex.test(this.newPartitionName)) {
      this.partitionNameError =
        'Only contains letters and numbers. Special characters and spaces are not allowed';
    } else {
      this.partitionNameError = null;
    }
  }

  addPartition(): void {
    this.validatePartitionName();
    if (this.partitionNameError === null) {
      this.loaderService.setLoading(true);
      this.userService.addPartition(this.newPartitionName).subscribe(
        (response) => {
          this.hideAddPartitionModal();
          this.loaderService.setLoading(false);
          this.fetchPartitions();
          if (response.status === 'Success') {
            this.successMessage = response.successMessage;
          } else {
            this.errorMessage = response.errorMessage;
          }
        },
        (error) => {
          console.error('Error adding partition:', error);
          this.loaderService.setLoading(false);
        }
      );
    }
  }

  showUpdatePartitionModal(): void {
    this.isUpdatePartitionModalVisible = true;
  }

  hideUpdatePartitionModal(): void {
    this.isUpdatePartitionModalVisible = false;
  }

  showDeletePartitionConfirmationModal(partitionId: number) {
    this.currentPartitionIdToDelete = partitionId;
    this.isDeletePartitionVisible = true;
  }

  hideDeletePartitionConfirmationModal() {
    this.currentPartitionIdToDelete = 0;
    this.isDeletePartitionVisible = false;
  }

  deletePartition(partitionId: number): void {
    this.loaderService.setLoading(true);
    this.userService.deletePartition(partitionId).subscribe(
      (response) => {
        this.loaderService.setLoading(false);
        this.fetchPartitions();
        if (response.status === 'Success') {
          this.successMessage = response.successMessage;
        } else {
          this.errorMessage = response.errorMessage;
        }
        this.hideDeletePartitionConfirmationModal();
      },
      (error) => {
        console.error('Error deleting partition:', error);
        this.loaderService.setLoading(false);
      }
    );
  }

  hideAlert() {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
