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

  constructor(
    private router: Router
  ) {}

  toggleUserManagementDropdown() {
    this.userManagementDropdownOpen = !this.userManagementDropdownOpen;
  }

  navigateDashboard(){
    this.router.navigate(['/dashboard']);
  }
}
