import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  inboxDropdownOpen = false;

  toggleInboxDropdown() {
    this.inboxDropdownOpen = !this.inboxDropdownOpen;
  }
}
