import { Component, ElementRef, Inject, ViewChild, inject } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef, } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore.service';
import { StorageService } from '../../../services/storage.service';
import { User } from '../../../../models/user.class';
import { channelDataclientService } from '../../../services/channelsDataclient.service';

@Component({
  selector: 'app-show-member-dialog',
  standalone: true,
  imports: [MatCard, MatIconModule, MatButtonModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './show-member-dialog.component.html',
  styleUrl: './show-member-dialog.component.scss'
})
export class ShowMemberDialogComponent {
  constructor(private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ShowMemberDialogComponent>) {
    this.users = data.allUsers

  }

  channelData: any;
  usersInChannel: any;
  channelId: any;
  showMemberSection = true;
  addMemberSection = false;
  currentName: any;
  selectedOption: string = '';
  userList!: any[];
  users: any[] = [];
  selectedUser: any[] = [];
  @ViewChild('userListDialog') userListDialog: any;
  @ViewChild('userInput') userInput!: ElementRef<HTMLInputElement>;
  dialogReference: MatDialogRef<any> | null = null;
  fireStoreService = inject(FirestoreService)
  downloadService = inject(StorageService)
  channelService = inject(channelDataclientService)


  async ngOnInit() {
    this.channelData = this.data.channelData
    this.usersInChannel = this.channelData.usersInChannel
    this.channelId = this.channelData.id
    console.log();
    await this.loadProfilePictures(this.users)
    this.filterUsersInChannel();

  }


  filterUsersInChannel() {
    if (this.data.channelData && this.data.channelData.usersInChannel) {
      const usersInChannelIds = this.usersInChannel.map((user: any) => user.id);


      this.users = this.users.filter(user => !usersInChannelIds.includes(user.id));
      console.log(this.users);
    }
  }


  closeDialog() {
    this.dialogRef.close()
  }


  openAddMemberSection() {
    this.showMemberSection = false;
    this.addMemberSection = true;
  }


  showUser() {
    this.openDialog();

    if (!this.currentName || this.currentName.trim() === '') {
      // Wenn kein Suchbegriff vorhanden ist, alle Benutzer anzeigen, die nicht ausgewählt wurden
      this.userList = this.users.filter(user => !this.selectedUser.some(selected => selected.id === user.id));
    } else {
      // Wenn ein Suchbegriff vorhanden ist, nach dem Suchbegriff filtern und dann nur die Benutzer anzeigen, die nicht ausgewählt wurden
      this.userList = this.users.filter((user) => {
        const userClean = user.name.replace(/\s/g, '');
        const userCleanSmall = userClean.toLowerCase();
        if (userCleanSmall.includes(this.currentName)) {
          return user;
        }
      }).filter(user => !this.selectedUser.some(selected => selected.id === user.id));
    }
  }


  chooseUser(userId: string) {
    const userToAdd = this.users.filter(user => user.id === userId);
    if (userToAdd.length > 0) {
      this.selectedUser.push(...userToAdd);
      console.log('Selected users:', this.selectedUser);
    } else {
      console.log('User not found with ID:', userId);
    }
    this.showUser()
  }


  openDialog() {
    if (!this.dialogReference) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.hasBackdrop = true;
      dialogConfig.backdropClass = 'cdk-overlay-transparent-backdrop'
      if (this.data && this.data.mouseEventData) {
        const mouseEventData = this.data.mouseEventData;
        const offsetLeft = 370;
        const offsetY = 155;
        dialogConfig.position = { top: `${mouseEventData.clientY + offsetY}px`, left: `${mouseEventData.clientX - offsetLeft}px` };
      }
      dialogConfig.autoFocus = false; // Dialog erhält keinen Fokus automatisch
      dialogConfig.closeOnNavigation = true; // Dialog bleibt ge

      this.dialogReference = this.dialog.open(this.userListDialog, dialogConfig);


      this.dialogReference.afterOpened().subscribe(() => {
        this.userInput.nativeElement.focus();
      });

      this.dialogReference.afterClosed().subscribe(() => {
        this.dialogReference = null;
      });
    }
  }


  /**
   * Prevent Closing the userlist dialog, when click on inputfield for searching user
   */
  preventDialogClose(event: MouseEvent): void {
    event.stopPropagation(); // Verhindert, dass das Klickereignis den Dialog schließt
  }


  /**
   * This function controls if the user use a own profile picture and the downloaded the image . After this the array Alluser is updatet.
   */
  async loadProfilePictures(users: User[]) {
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
          // Setzen Sie den Zustand auf falsch, wenn ein Bild nicht geladen werden konnte
        }
      }
    }
  }


  /**
  * This function removes the selected user for the Channel 
  */
  removeSelectedUser(userId: any) {
    this.selectedUser = this.selectedUser.filter(user => user.id !== userId);
    console.log('Selected users after removal:', this.selectedUser);

  }


 async addUserToChannel(channelId: any) {
   await this.channelService.addUserToChannel(channelId, this.selectedUser);
   for(const user of this.selectedUser){
    await this.fireStoreService.updateUsersChannels(user.id, channelId)
   }
   
   this.closeDialog()
  }

}
