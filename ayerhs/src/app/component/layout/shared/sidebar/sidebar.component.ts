import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  userManagementDropdownOpen = false;
  sidebarOpen = false;

  constructor(private router: Router) {}

  toggleUserManagementDropdown() {
    this.userManagementDropdownOpen = !this.userManagementDropdownOpen;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  navigateDashboard() {
    this.router.navigate(['/dashboard']);
  }

  navigateToPartitions() {
    this.router.navigate(['/user/partitions']);
  }

  navigateToGroups() {
    this.router.navigate(['/user/groups']);
  }
}
