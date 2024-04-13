import { Component, ElementRef, Inject, TemplateRef, ViewChild, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { channel } from '../../../../../models/channels.class';
import { CommonModule } from '@angular/common';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogRef,
  MatDialogConfig,
  MatDialogClose,
} from '@angular/material/dialog';
import { channelDataclientService } from '../../../../services/channelsDataclient.service';

@Component({
  selector: 'app-add-user-channel-dialog',
  standalone: true,
  imports: [MatCardModule, MatButton, MatIcon, FormsModule, ReactiveFormsModule, CommonModule, MatDialogTitle, MatDialogContent, MatDialogClose],
  templateUrl: './add-user-channel-dialog.component.html',
  styleUrl: './add-user-channel-dialog.component.scss'
})
export class AddUserChannelDialogComponent {
  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,   public originalDialogRef: MatDialogRef<AddUserChannelDialogComponent>) {
    console.log('Übergebene Daten:', data);
    this.users = data.users;

  }
  newChannel: channel = new channel();
  @ViewChild('userListDialog') userListDialog: any;
  @ViewChild('userInput') userInput!: ElementRef<HTMLInputElement>;
  dialogRef: MatDialogRef<any> | null = null;
  


  selectedOption: string = '';
  currentName: string = '';
  userList!: any[];
  selectedUser: any[] = [];
  users: any[] = [];
  channelDataclient = inject(channelDataclientService);


  showUser() {
   this.openDialog()
    if (this.currentName.trim() === '') {
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


  openDialog() {
    if (!this.dialogRef) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.hasBackdrop = true;
      dialogConfig.backdropClass = 'cdk-overlay-transparent-backdrop'
      // dialogConfig.position = {
      //   top: '218px', // Definieren Sie die gewünschte Top-Position
      //   left: '416px' // Definieren Sie die gewünschte Left-Position
      // };
      dialogConfig.autoFocus = false; // Dialog erhält keinen Fokus automatisch
      dialogConfig.closeOnNavigation = true; // Dialog bleibt ge

      this.dialogRef = this.dialog.open(this.userListDialog, dialogConfig);

      
      this.dialogRef.afterOpened().subscribe(() => {
        this.userInput.nativeElement.focus();
      });
      
      this.dialogRef.afterClosed().subscribe(() => {
        this.dialogRef = null;
      });
    }
  }


  closeDialog(): void {
   this.originalDialogRef.close()
  }


  /**
   * Prevent Closing the userlist dialog, when click on inputfield for searching user
   */
  preventDialogClose(event: MouseEvent): void {
    event.stopPropagation(); // Verhindert, dass das Klickereignis den Dialog schließt
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

  /**
   * This function removes the selected user for the Channel 
   */
  removeSelectedUser(userId: any) {
    this.selectedUser = this.selectedUser.filter(user => user.id !== userId);
    console.log('Selected users after removal:', this.selectedUser);

  }


  addUsersToChannel() {
    if (this.selectedOption === 'allUsers') {
      this.selectedUser = [...this.users];
      this.newChannel.usersInChannel = this.selectedUser;
    } else if (this.selectedOption === 'specificPeople') {
      this.newChannel.usersInChannel = this.selectedUser;
    }
    // Hier kann die Service funktion eingefügt werden 
    console.log(this.newChannel);
    this.channelDataclient.storeNewChannel(this.newChannel);
  }

}
