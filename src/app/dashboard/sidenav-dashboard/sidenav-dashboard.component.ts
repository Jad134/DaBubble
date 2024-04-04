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
  ViewChildren,
  QueryList,
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
import { AddChannelComponent } from './add-channel/add-channel.component';
import { StorageService } from '../../services/storage.service';
import { User } from '../../../models/user.class';
import { ActivatedRoute } from '@angular/router';
import { channelDataclientService } from '../../services/channelsDataclient.service';


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
  downloadService = inject(StorageService);
  channelService =inject(channelDataclientService)
  channelOverlay: boolean = false;
  userIds: any;
  currentUserId: any;
  profilePicturesLoaded: boolean = false;
  addChannelOverlay: boolean = false;
  channelsmenu: boolean = true;
  userMenu: boolean = true;
  channelNames :any;
  @Input() users: User[] = [];
  @ViewChildren('profilePicture') profilePictures!: QueryList<ElementRef>;
  @ViewChildren('statusLight') statusLights!: QueryList<ElementRef>;

  constructor(private route: ActivatedRoute) { }

  /**
   * This function downloaded the userdata and starts the imagedownloadfunction. After this, the datas are rendering at html
   */

  ngAfterViewInit(): void {
    this.getIdFromURL();
    this.firestoreService
      .getAllUsers()
      .then(async (users) => {
        // Laden Sie die Bilder aus dem Storage für jeden Benutzer
        await this.loadProfilePictures(users);

        // Handle users data
        this.users = users;
        console.log(this.users);
      })
      .catch((error) => {
        console.error('Fehler beim Abrufffen der Benutzerdaten:', error);
      });

    this.downloadChannels(this.currentUserId)
  }


  /**
   * This function controls if the user use a own profile picture and the downloaded the image . After this the array Alluser is updatet.
   */
  async loadProfilePictures(users: User[]) {
    let allProfilePicturesLoaded = true; // Annahme: Alle Bilder sind zunächst geladen
    for (const user of users) {
      if (user.avatar === 'ownPictureDA') {
        const profilePictureURL = `gs://dabubble-51e17.appspot.com/${user.id}/ownPictureDA`;
        try {
          const downloadedImageUrl = await this.downloadService.downloadImage(
            profilePictureURL
          );
          // Weisen Sie die heruntergeladenen Bild-URL dem Benutzerobjekt zu
          user.avatar = downloadedImageUrl;
        } catch (error) {
          console.error('Error downloading user profile picture:', error);
          allProfilePicturesLoaded = false; // Setzen Sie den Zustand auf falsch, wenn ein Bild nicht geladen werden konnte
        }
      }
    }
    this.profilePicturesLoaded = allProfilePicturesLoaded; // Setzen Sie das Flag basierend auf dem Ladezustand der Bilder
  }


  togglechannelsMenu() {
    this.channelsmenu = !this.channelsmenu;
  }

  toggleUsersMenu() {
    this.userMenu = !this.userMenu;
  }

  toggleChannelOverlay() {
    this.channelOverlay = !this.channelOverlay;
  }


  getIdFromURL() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.currentUserId = id;
    }
  }


 async downloadChannels(userId: any) {
    await this.channelService.getUserChannelId(userId);
  }
}
