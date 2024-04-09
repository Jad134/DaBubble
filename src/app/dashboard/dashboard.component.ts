import { Component, inject, AfterViewInit, ViewChild, ElementRef, } from '@angular/core';
import { HeadDashboardComponent } from './head-dashboard/head-dashboard.component';
import { SidenavDashboardComponent } from './sidenav-dashboard/sidenav-dashboard.component';
import { ChatDashboardComponent } from './chat-dashboard/chat-dashboard.component';
import { FirestoreService } from '../services/firestore.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.class';
import { StorageService } from '../services/storage.service';
import { ThreadComponent } from './thread/thread.component';
import { DirectChatComponent } from './direct-chat/direct-chat.component';
import { GroupChatComponent } from './group-chat/group-chat.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeadDashboardComponent, SidenavDashboardComponent, ChatDashboardComponent, ThreadComponent, DirectChatComponent, GroupChatComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})

export class DashboardComponent {
  constructor(private route: ActivatedRoute) { }
  firestoreService = inject(FirestoreService)
  downloadService = inject(StorageService)
  userId: any;
  users: User[] = [];
  profilePictureReady = false;
  @ViewChild('sidenav') sidenav!: SidenavDashboardComponent;
  groupChatVisible: boolean = false;
  directChatVisible: boolean = false;
  currentGroupChat!: string;
  currentDirectChat!: string;



  ngOnInit(): void {
    this.getIdFromURL();
    this.firestoreService.checkIfUserOnline(this.userId);
  }

  ngAfterViewInit(): void {
    this.firestoreService.getAllUsers().then(users => {
      // Handle users data
      this.users = users;
      console.log(this.users);


    }).catch(error => {
      console.error('Fehler beim Abrufffen der Benutzerdaten:', error);
    });
  }


  /**
   * This function get the id from the current logged in user from the url
   */
  getIdFromURL() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.userId = id;
    }
  }


  /**
  * This function sets the boolean to true or false to show with ngIf the right chat variant
  */
  handleGroupChatVisibility(event: boolean) {
    this.groupChatVisible = event;
  }


  /**
   * This function sets the boolean to true or false to show with ngIf the right chat variant
   */
  handleDirectChatVisibility(event: boolean) {
    this.directChatVisible = event;
  }


  handleCurrentGroupId(id: string) {
    this.currentGroupChat = id;
    console.log(this.currentGroupChat);

  }


  handleDirectChatId(id: string) {
    this.currentDirectChat = id;
  }
}
