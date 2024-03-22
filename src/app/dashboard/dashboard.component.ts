import { Component, inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HeadDashboardComponent } from './head-dashboard/head-dashboard.component';
import { SidenavDashboardComponent } from './sidenav-dashboard/sidenav-dashboard.component';
import { ChatDashboardComponent } from './chat-dashboard/chat-dashboard.component';
import { FirestoreService } from '../services/firestore.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.class';
import { AllUser } from '../../models/allUser.class';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeadDashboardComponent, SidenavDashboardComponent, ChatDashboardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})

export class DashboardComponent {
  constructor(private route: ActivatedRoute) { }
  firestoreService = inject(FirestoreService)
  downloadService = inject(StorageService)
  userId: any;
  users: User[] = [];
  allUsers: AllUser[] = [];
  profilePictureReady = false;
  @ViewChild('sidenav') sidenav!: SidenavDashboardComponent;
  

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
