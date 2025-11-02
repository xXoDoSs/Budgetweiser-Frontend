import { Component, OnInit, HostListener, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CommonModule} from '@angular/common';
import {CalendarComponent} from './calendar/calendar.component';
import { SettingsComponent } from './settings/settings';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  isSidebarCollapsed = signal<boolean>(false);
  screenWidth = signal<number>(window.innerWidth);

   @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < 768) {
      this.isSidebarCollapsed.set(true);
    }
  }

  ngOnInit(): void {
    this.isSidebarCollapsed.set(this.screenWidth() < 768);
  }

  changeIsSidebarCollapsed(isSidebarCollapsed: boolean): void {
    this.isSidebarCollapsed.set(isSidebarCollapsed);
  }
}
