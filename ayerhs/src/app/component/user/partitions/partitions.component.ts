import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { LoaderComponent } from '../../layout/loader/loader.component';
import { LoaderService } from '../../layout/loader/loader.service';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-partitions',
  standalone: true,
  imports: [NgIf, NgFor, LoaderComponent, CommonModule],
  templateUrl: './partitions.component.html',
  styleUrls: ['./partitions.component.css'],
})
export class PartitionsComponent {
  partitions: any[] = [];
  isLoading = false;
  private subscription: Subscription;
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private http: HttpClient,
    private loaderService: LoaderService,
    private router: Router
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
  }

  fetchPartitions(): void {
    if (typeof localStorage !== 'undefined') {
      this.loaderService.setLoading(true);
      const token = localStorage.getItem('authToken');
      this.http
        .get<any>(
          'https://localhost:44302/ayerhs-security/UserManagement/GetPartitions',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .subscribe(
          (response) => {
            if (response && response.returnValue) {
              this.partitions = response.returnValue;
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

  sortPartitions(): void {
    this.partitions.sort((a, b) => {
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
}
