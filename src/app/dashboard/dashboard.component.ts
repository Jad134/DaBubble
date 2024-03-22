import { Component, inject, AfterViewInit } from '@angular/core';
import { HeadDashboardComponent } from './head-dashboard/head-dashboard.component';
import { SidenavDashboardComponent } from './sidenav-dashboard/sidenav-dashboard.component';
<<<<<<< HEAD
import { ChatDashboardComponent } from './chat-dashboard/chat-dashboard.component';
=======
import { FirestoreService } from '../services/firestore.service';

import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.class';
import { AllUser } from '../../models/allUser.class';

>>>>>>> 87e6d35db5871eba19f3d60dd44ca6b9106c4d9c

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeadDashboardComponent, SidenavDashboardComponent,ChatDashboardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})

export class DashboardComponent {
  constructor(private route: ActivatedRoute) { }
  firestoreService = inject(FirestoreService)
  userId: any;
  users: User[] = [];
  allUsers: AllUser[] = [];


  ngOnInit(): void {
    this.getIdFromURL(); 
    
  }

  ngAfterViewInit(): void {
    this.firestoreService.getAllUsers().then(users => {
      // Handle users data
      this.allUsers = users;
      console.log(this.allUsers);
      
    }).catch(error => {
      console.error('Fehler beim Abrufffen der Benutzerdaten:', error);
    });
  }


  getIdFromURL() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.userId = id;
    }
  }
}
