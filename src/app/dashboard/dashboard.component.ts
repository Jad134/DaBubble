import { Component, inject } from '@angular/core';
import { HeadDashboardComponent } from './head-dashboard/head-dashboard.component';
import { SidenavDashboardComponent } from './sidenav-dashboard/sidenav-dashboard.component';
import { FirestoreService } from '../services/firestore.service';

import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.class';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeadDashboardComponent, SidenavDashboardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})

export class DashboardComponent {
  constructor(private route: ActivatedRoute) { }
  firestoreService = inject(FirestoreService)
  userId: any;
  users: User[] = [];


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
