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
  OnDestroy,
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
import { Subscription } from 'rxjs';
import { SharedServiceService } from '../../services/shared-service.service';

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
export class SidenavDashboardComponent implements OnDestroy {
  private subscription: Subscription| undefined;
  firestoreService = inject(FirestoreService);
  downloadService = inject(StorageService);
  channelService = inject(channelDataclientService);
  channelOverlay: boolean = false;
  userIds: any;
  currentUserId: any;
  profilePicturesLoaded: boolean = false;
  addChannelOverlay: boolean = false;
  channelsmenu: boolean = true;
  userMenu: boolean = true;
  channelNames: any;
  @Input() users: User[] = [];
  @ViewChildren('profilePicture') profilePictures!: QueryList<ElementRef>;
  @ViewChildren('statusLight') statusLights!: QueryList<ElementRef>;
  @Output() groupChatEvent = new EventEmitter<boolean>();
  @Output() directChatEvent = new EventEmitter<boolean>();
  @Output() clickedChannelIdEvent = new EventEmitter<string>();
  @Output() clickedUserIdEvent = new EventEmitter<string>();

  constructor(private route: ActivatedRoute, private sharedService: SharedServiceService) {
    this.subscription = this.sharedService.selectedUserId$.subscribe(userId => {
      if (userId) {
        this.openDirectChat(userId);
      }
    });
  }

  sidenavIsHide: boolean = false;
  imageUrl: string = '../../../assets/img/close-menu.svg';

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  

  /**
   *this function toggle the variable sidenavIsHide to true, if sidenav closed
   */
  toggleSidenav() {
    this.sidenavIsHide = !this.sidenavIsHide;
  }
  /**
   * change the src für the "Workspace Menü" button bei hover it
   */
  onMouseEnter(): void {
    if (!this.sidenavIsHide) {
      this.imageUrl = '../../../assets/img/close-menu-hover.svg';
    } else {
      this.imageUrl = '../../../assets/img/open-menu-hover.svg';
    }
  }

   /**
   * change the src für the "Workspace Menü" button bei hover it
   */
  onMouseLeave(): void {
    if (!this.sidenavIsHide) {
      this.imageUrl = '../../../assets/img/close-menu.svg';
    } else {
      this.imageUrl = '../../../assets/img/open-menu.svg';
    }
  }

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
      })
      .catch((error) => {
        console.error('Fehler beim Abrufffen der Benutzerdaten:', error);
      });

    this.downloadChannels(this.currentUserId);
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

  openGroupChat(id: any) {
    this.directChatEvent.emit(false);
    this.groupChatEvent.emit(true);
    this.clickedChannelIdEvent.emit(id);
  }

  openDirectChat(id: any) {
    this.groupChatEvent.emit(false);
    this.directChatEvent.emit(true);
    this.clickedUserIdEvent.emit(id);
  }
}
