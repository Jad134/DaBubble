import { CommonModule } from '@angular/common';
import {
  Component,
  Output,
  EventEmitter,
  Input,
  inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { channel } from '../../../../models/channels.class';
import { FirestoreService } from '../../../services/firestore.service';
import { MatDialog, MatDialogModule, MatDialogConfig } from '@angular/material/dialog';


import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { channelDataclientService } from '../../../services/channelsDataclient.service';
import { ActivatedRoute } from '@angular/router';
import { AddUserChannelDialogComponent } from './add-user-channel-dialog/add-user-channel-dialog.component';

@Component({
  selector: 'app-add-channel',
  standalone: true,
  imports: [MatButton, MatIcon, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-channel.component.html',
  styleUrl: './add-channel.component.scss',
  animations: [
    trigger('fadeIn', [
      state(
        'void',
        style({
          opacity: 0,
        })
      ),
      transition('void => *', [animate(300)]),
    ]),
  ],
})
export class AddChannelComponent {
  newChannel: channel = new channel();
  @Input() users: any[] = [];
  @ViewChild('channelName') channelName!: ElementRef;
  @ViewChild('validChannelName') validChannelName!: ElementRef;
  @Output() close = new EventEmitter<void>();
  userOverlay: boolean = false;
  selectedOption: string = '';
  currentName: string = '';
  userList!: any[];
  selectedUser: any[] = [];
  currentUserId: any;
  firestore = inject(FirestoreService);
  channelDataclient = inject(channelDataclientService);
  channelAdmin:any;

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    this.getIdFromURL()
  }

  ngAfterViewInit(): void {
    this.addChannelAdmin()
  }

  closeOverlay() {
    this.close.emit();
  }

  // toggleUserOverlay() {
  //   this.userOverlay = !this.userOverlay;
  // }

  getIdFromURL() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.currentUserId = id;
    }
  }

  addChannelAdmin() {
    const channelAdmin = this.users.find(user => user.id === this.currentUserId);
    if (channelAdmin) {
      this.selectedUser.push(channelAdmin);
      this.channelAdmin = channelAdmin
      console.log('Channel Admin added:', channelAdmin);
    } else {
      console.log('Channel Admin not found with ID:', this.currentUserId);
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

  checkFormChannelName() {
    const channelName = this.channelName.nativeElement;
    const validChannelName = this.validChannelName.nativeElement;
    if (channelName.validity.valid) {
      // this.toggleUserOverlay();
      this.openDialog()
      validChannelName.style = 'opacity: 0';
    } else {
      validChannelName.style = 'opacity: 1';
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddUserChannelDialogComponent, {
      data: {
        channelAdmin: this.channelAdmin,
        channelName: this.newChannel.name,
        description: this.newChannel.description,
        users: this.users // Übergeben Sie die Benutzerdaten hier
      }
    });
  }

  showUser() {
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


  /**
   * This function removes the selected user for the Channel 
   */
  removeSelectedUser(userId: any) {
    this.selectedUser = this.selectedUser.filter(user => user.id !== userId);
    console.log('Selected users after removal:', this.selectedUser);

  }
}
