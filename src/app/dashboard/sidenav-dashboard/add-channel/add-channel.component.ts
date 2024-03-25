import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
FirestoreService;

@Component({
  selector: 'app-add-channel',
  standalone: true,
  imports: [MatButton, MatIcon, CommonModule, FormsModule],
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
  @Input() allUsers: any[] = [];
  @Output() close = new EventEmitter<void>();
  userOverlay: boolean = false;
  selectedOption: string = '';
  currentName: string = '';

  firestore = inject(FirestoreService);

  closeOverlay() {
    this.close.emit();
  }

  toggleUserOverlay() {
    this.userOverlay = !this.userOverlay;
  }

  showUser() {
    const userList = this.allUsers.filter((user) => {
      const userClean = user.name.replace(/\s/g, '');
      const userCleanSmall = userClean.toLowerCase();
      if (userCleanSmall.includes(this.currentName)) {
        return user;
      }
    });
  }
}
