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

@Component({
  selector: 'app-partitions',
  standalone: true,
  imports: [NgIf, NgFor, LoaderComponent, CommonModule],
  templateUrl: './partitions.component.html',
  styleUrls: ['./partitions.component.css'],
})
export class PartitionsComponent {
  partitions: any[] = [];
  filteredPartitions: any[] = [];
  isLoading = false;
  private subscription: Subscription;
  sortDirection: 'asc' | 'desc' = 'asc';
  private searchTerms = new Subject<string>();

  constructor(
    private http: HttpClient,
    private loaderService: LoaderService,
    private router: Router,
    private userService: UserService
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
      this.userService.getPartitions()
        .subscribe(
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
}
