import { Component } from '@angular/core';
import { HeadDashboardComponent } from './head-dashboard/head-dashboard.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeadDashboardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
