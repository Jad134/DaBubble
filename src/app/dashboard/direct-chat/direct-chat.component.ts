import { Component, Input, SimpleChanges, inject } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserDetailDialogComponent } from '../user-detail-dialog/user-detail-dialog.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-direct-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './direct-chat.component.html',
  styleUrl: './direct-chat.component.scss'
})
export class DirectChatComponent {
  @Input() currentId!: string;
  fireStoreService = inject(FirestoreService)
  downloadService = inject(StorageService);
  currentUserData: any;

  constructor(public dialog: MatDialog,){}


  /**
   * This function checks changes for updating the chat component
   */
  async ngOnChanges(changes: SimpleChanges) {
    if (changes['currentId']) {
      await this.loadCurrentDatas();
      await this.loadProfilePictures();
    }
  }


  /**
   * This function download get the datas from the user for the Private chat
   */
  async loadCurrentDatas() {
    try {
      const data = await this.fireStoreService.getUserDataById(this.currentId);
      this.currentUserData = data;

      console.log(this.currentUserData);

    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error);
    }
  }


  /**
   * This function checks if the user used a own profile picture and downloaded the url with the function from downloadService. After that the currentUser will be updatet.
   */
  async loadProfilePictures() {
    try {
      if (!this.currentUserData || typeof this.currentUserData !== 'object') {
        throw new Error('currentUserData is not an object');
      }
      if (this.currentUserData.avatar === 'ownPictureDA') {
        const profilePictureURL = `gs://dabubble-51e17.appspot.com/${this.currentUserData.id}/ownPictureDA`;
        try {
          this.setProfilePictureToUser(profilePictureURL)
        } catch (error) {
          console.error('Error downloading user profile picture:', error);
        }
      }
    } catch (error) {
      console.error('Error loading profile pictures:', error);
    }
  }


  /**
   * This function push the right url for own profile pictures to the user 
   */
 async setProfilePictureToUser(profilePictureURL: string) {
    const downloadedImageUrl = await this.downloadService.downloadImage(profilePictureURL);
    this.currentUserData.avatar = downloadedImageUrl;
  }


    /**
   * open the user detail dialog
   */
    openUserDetail(id: string) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.position = {
        top: '100px',
        right: '20px'
      };
      dialogConfig.panelClass = 'transparent-dialog';
      dialogConfig.data = {
        userId: id,
      }
      this.dialog.open(UserDetailDialogComponent, dialogConfig);
    }

}
