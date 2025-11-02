import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'sidebar-component',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  isSidebarCollapsed = input.required<boolean>();
  changeIsSidebarCollapsed = output<boolean>();
  items = [
  { label: 'Dashboard', routeLink: '/dashboard', icon: 'dashboard' },
  { label: 'Kalender',  routeLink: '/calendar',  icon: 'calendar_month' },
  { label: 'Einstellungen', routeLink: '/settings', icon: 'settings' }
];

  toggleCollapse(): void {
    this.changeIsSidebarCollapsed.emit(!this.isSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsSidebarCollapsed.emit(true);
  }
}