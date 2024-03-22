import {
  Component,
  ElementRef,
  ViewChild,
  viewChild,
  Renderer2,
  inject,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  state,
  trigger,
  animate,
  style,
  transition,
} from '@angular/animations';
import { FirestoreService } from '../../services/firestore.service';
import { AllUser } from '../../../models/allUser.class';
import { AddChannelComponent } from './add-channel/add-channel.component';
import { StorageService } from '../../services/storage.service';
@Component({
  selector: 'app-sidenav-dashboard',
  standalone: true,
  imports: [CommonModule, AddChannelComponent],
  templateUrl: './sidenav-dashboard.component.html',
  styleUrl: './sidenav-dashboard.component.scss',
  animations: [
    trigger('menuVisibility', [
      state('visible', style({ opacity: 1, height: '*' })),
      state('hidden', style({ opacity: 0, height: '0px' })),
      transition('visible <=> hidden', [animate('200ms ease-in-out')]), // Adjust duration and timing as needed
    ]),
  ],
})
export class SidenavDashboardComponent {
  firestoreService = inject(FirestoreService);
  downloadService = inject(StorageService)
  channelOverlay: boolean = false;
  userIds: any;
  // allUsers: AllUser[] = [];

  constructor(private renderer: Renderer2) { }

  @Input() allUsers: AllUser[] = [];
  @ViewChild('profilePicture') profilePicture!: ElementRef;
  addChannelOverlay: boolean = false
  // ngOnInit(): void {
  //   // this.firestoreService.getAllUsers().then(users => {
  //   //   this.allUsers = users;
  //   //   console.log(this.allUsers); // Hier haben Sie Zugriff auf die heruntergeladenen Benutzerdaten
  //   // }).catch(error => {
  //   //   console.error('Fehler beim Abrufen der Benutzerdaten:', error);
  //   // });

    
  // }

  ngAfterViewInit(): void {
    this.firestoreService.getAllUsers().then(users => {
      // Handle users data
      this.allUsers = users;
      console.log(this.allUsers);
  
      // Nachdem die Benutzerdaten abgerufen wurden, rufen Sie die Funktion für jeden Benutzer auf
      this.allUsers.forEach(user => {
        this.controlIfOwnPictureUsed(user);
      });
  
    }).catch(error => {
      console.error('Fehler beim Abrufffen der Benutzerdaten:', error);
    });
  }

  


  channelsmenu: boolean = true;
  userMenu: boolean = true;

  togglechannelsMenu() {
    this.channelsmenu = !this.channelsmenu;
  }

  toggleUsersMenu() {
    this.userMenu = !this.userMenu;
  }

  toggleChannelOverlay() {
    this.channelOverlay = !this.channelOverlay;
  }




  async controlIfOwnPictureUsed(user: AllUser) {
    const profilePictureElement = document.getElementById('profilePicture_' + user.id) as HTMLImageElement;
    if (profilePictureElement) {
      if (user.avatar === 'ownPictureDA') {
        // User has uploaded their own picture
        // Download the picture from storage
        const profilePictureURL = `gs://dabubble-51e17.appspot.com/${user.id}/ownPictureDA`;
        try {
          const downloadedImageUrl = await this.downloadService.downloadImage(profilePictureURL);
          // Set the downloaded image URL as the source of the profile picture element
          profilePictureElement.src = downloadedImageUrl;
        } catch (error) {
          console.error('Error downloading user profile picture:', error);
        }
      } else {
        // User is using a default picture or no picture
        // Set the user's default picture URL as the source of the profile picture element
        profilePictureElement.src = user.avatar;
      }
    } else {
      console.error('Bild-Element nicht gefunden für Benutzer mit ID:', user.id);
    }
  }
}


