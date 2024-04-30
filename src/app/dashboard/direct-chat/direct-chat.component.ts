import { Component, ElementRef, Input, SimpleChanges, ViewChild, inject } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { UserDetailDialogComponent } from '../user-detail-dialog/user-detail-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { EmojiDialogComponent } from '../../emoji-dialog/emoji-dialog.component';
import { DirectChatService } from '../../services/direct-chat.service';
import { FormsModule } from '@angular/forms'
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-direct-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
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
  editedMessageIndex: number | null = null;
  messageForEdit: any;
  showButton: boolean[] = Array(this.directChatService.chatDatas.length).fill(false);
  dialogReference: MatDialogRef<any> | null = null;
  @ViewChild('editMessageDialog') editMessageDialog: any;
  message:any;
  



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
    await this.loadCurrentChat()
  }


  async loadCurrentChat() {
    await this.directChatService.getCurrentChats(this.currentUserId, this.currentChatPartnerId);
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
  let timeStamp = Date.now()
  this.directChatService.sendChat(this.currentUserId, this.currentChatPartnerId, timeStamp)
}


cancelEdit() {
  this.editedMessageIndex = null;
}


async saveEdit(messageId: any, message: any) {
  await this.directChatService.editMessage(this.currentUserId, this.currentChatPartnerId, message, messageId)
  this.editedMessageIndex = null;
}


getUserAvatar(userId: string){
}


 /**
   * This function open the dialog for the button to edit a Message
   * @param event mouseclick
   * @param i index
   */
 openEditMessageDialog(event: MouseEvent, i: number) {
  this.dontLeaveHover(i)
  if (!this.dialogReference) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.hasBackdrop = true;
    dialogConfig.backdropClass = 'cdk-overlay-transparent-backdrop'
    this.setEditMessageDialogPosition(event, dialogConfig)
    this.dialogReference = this.dialog.open(this.editMessageDialog, dialogConfig);

    this.dialogReference.afterClosed().subscribe(() => {
      this.dialogReference = null; // Setzen Sie this.dialogReference auf null, wenn der Dialog geschlossen wurde
      this.showButton[i] = false;
    });
  }
}


/**
 * This function returns the position of the mouseclick
 * @param event mouseclick
 * @returns position of the mouseclick
 */
setEditMessageDialogPosition(event: MouseEvent, dialogConfig: MatDialogConfig<any>, ) {
  const offsetLeft = 0;
  const offsetY = 0;
  return dialogConfig.position = { top: `${event.clientY + offsetY}px`, left: `${event.clientX - offsetLeft}px` };
}


/**
 * This function sets the showbutton variable to true with timeout, because the (mouseleave) sets the variable with delay of false. Its for the
 * design when dialog edit message is open the hover effect doesnt go away
 * @param i index of message 
 */
dontLeaveHover(i: number) {
  setTimeout(() => {
    this.showButton[i] = true;
  }, 3);
}


async editMessage(messageId: any, messageIndex: number) {
  let message = await this.directChatService.getMessageForEdit(this.currentUserId, this.currentChatPartnerId, messageId)
  console.log(message);
  this.editedMessageIndex = messageIndex;
  this.messageForEdit = message;
  this.dialogReference?.close()
}

}
