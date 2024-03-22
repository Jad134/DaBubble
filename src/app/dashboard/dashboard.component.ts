import { Component } from '@angular/core';
import { HeadDashboardComponent } from './head-dashboard/head-dashboard.component';
import { SidenavDashboardComponent } from './sidenav-dashboard/sidenav-dashboard.component';
import { ChatDashboardComponent } from './chat-dashboard/chat-dashboard.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeadDashboardComponent, SidenavDashboardComponent,ChatDashboardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
