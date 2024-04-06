import { Component, Inject, TemplateRef, ViewChild, inject } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NgModule }      from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { channel } from '../../../../../models/channels.class';
import { CommonModule } from '@angular/common';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { channelDataclientService } from '../../../../services/channelsDataclient.service';

@Component({
  selector: 'app-add-user-channel-dialog',
  standalone: true,
  imports: [MatCardModule, MatButton,MatIcon, FormsModule, ReactiveFormsModule, CommonModule, MatDialogTitle, MatDialogContent],
  templateUrl: './add-user-channel-dialog.component.html',
  styleUrl: './add-user-channel-dialog.component.scss'
})
export class AddUserChannelDialogComponent {
  constructor(public dialog: MatDialog,  @Inject(MAT_DIALOG_DATA) public data:any) {
    console.log('Übergebene Daten:', data);
    this.users = data.users;
    
  }
  newChannel: channel = new channel();
  @ViewChild('userListDialog') userListDialog: any;

  selectedOption: string = '';
  currentName: string = '';
  userList!: any[];
  selectedUser: any[] = [];
  users: any[] = [];
  channelDataclient = inject(channelDataclientService);


  showUser(){
    this.dialog.open(this.userListDialog)
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
