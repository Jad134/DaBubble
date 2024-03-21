import { Component, inject } from '@angular/core';
import { HeadDashboardComponent } from './head-dashboard/head-dashboard.component';
import { SidenavDashboardComponent } from './sidenav-dashboard/sidenav-dashboard.component';
import { FirestoreService } from '../services/firestore.service';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeadDashboardComponent, SidenavDashboardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})

export class DashboardComponent {
  constructor(private route: ActivatedRoute) { }
  test = inject(FirestoreService)
  userId: any;


  ngOnInit(): void {
    this.getIdFromURL();
  }


  getIdFromURL() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.userId = id;
    }
  }
}
