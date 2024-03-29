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

import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { channelDataclientService } from '../../../services/channelsDataclient.service';

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

  firestore = inject(FirestoreService);
  channelDataclient = inject(channelDataclientService);

  closeOverlay() {
    this.close.emit();
  }

  toggleUserOverlay() {
    this.userOverlay = !this.userOverlay;
  }

  chooseUser(userId: string) {
    const userToAdd = this.users.filter(user => user.id === userId);
    if (userToAdd.length > 0) {
      this.selectedUser.push(...userToAdd);
      console.log('Selected users:', this.selectedUser);
    } else {
      console.log('User not found with ID:', userId);
    }
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
      this.toggleUserOverlay();
      validChannelName.style = 'opacity: 0';
    } else {
      validChannelName.style = 'opacity: 1';
    }
  }

  showUser() {
    this.userList = this.users.filter((user) => {
      const userClean = user.name.replace(/\s/g, '');
      const userCleanSmall = userClean.toLowerCase();
      if (userCleanSmall.includes(this.currentName)) {
        return user;
      }
    });
  }
}
