import { Component, ElementRef, Input, SimpleChanges, ViewChild, inject } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserDetailDialogComponent } from '../user-detail-dialog/user-detail-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { EmojiDialogComponent } from '../../emoji-dialog/emoji-dialog.component';
import { DirectChatService } from '../../services/direct-chat.service';
import { doc, getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';


@Component({
  selector: 'app-direct-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './direct-chat.component.html',
  styleUrl: './direct-chat.component.scss'
})
export class DirectChatComponent {
  @Input() currentChatPartnerId!: string;
  fireStoreService = inject(FirestoreService)
  downloadService = inject(StorageService);
  currentUserData: any;
  directChatService = inject(DirectChatService);
  currentUserId: any;



  constructor(public dialog: MatDialog, private route: ActivatedRoute) {
    this.getIdFromURL()
  }


  getIdFromURL() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.currentUserId = id;
    }
  }


  /**
   * This function checks changes for updating the chat component
   */
  async ngOnChanges(changes: SimpleChanges) {
    if (changes['currentChatPartnerId']) {
      await this.loadCurrentDatas();
      await this.loadProfilePictures();
    }
  }


  /**
   * This function download get the datas from the other user for the Private chat
   */
  async loadCurrentDatas() {
    try {
      const data = await this.fireStoreService.getUserDataById(this.currentChatPartnerId);
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
          await this.setProfilePictureToUser(profilePictureURL)
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

  /**
   * open the emojiDialog and insert the returned emoji in the textarea field
   */
  openEmojiDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      bottom: '250px',
      left: '400px'
    };
    dialogConfig.backdropClass = 'cdk-overlay-transparent-backdrop';

    this.dialog.open(EmojiDialogComponent, dialogConfig).afterClosed().subscribe((selectedEmoji: string | undefined) => {
      if (selectedEmoji) {
        const textarea = document.getElementById('answer') as HTMLTextAreaElement;
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;

        const textBeforeCursor = textarea.value.substring(0, startPos);
        const textAfterCursor = textarea.value.substring(endPos, textarea.value.length);
        textarea.value = textBeforeCursor + selectedEmoji + textAfterCursor;

        const newCursorPosition = startPos + selectedEmoji.length;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);

        textarea.dispatchEvent(new Event('input'));

        textarea.focus();
      }
    });
  }

sendChat(){
  this.directChatService.sendChat(this.currentUserId, this.currentChatPartnerId)
}

}
