import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { LoaderComponent } from '../../layout/loader/loader.component';
import { LoaderService } from '../../layout/loader/loader.service';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-partitions',
  standalone: true,
  imports: [NgIf, NgFor, LoaderComponent],
  templateUrl: './partitions.component.html',
  styleUrls: ['./partitions.component.css'],
})
export class PartitionsComponent {
  partitions: any[] = [];
  isLoading = false;
  private subscription: Subscription;

  constructor(private http: HttpClient, private loaderService: LoaderService, private router: Router,) {
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
}
