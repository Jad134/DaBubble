import { Component, Input, Inject, inject, SimpleChanges, ElementRef } from '@angular/core';
import { channelDataclientService } from '../../services/channelsDataclient.service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditGroupChannelDialogComponent } from './edit-group-channel-dialog/edit-group-channel-dialog.component';
import { FormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';
import { ShowMemberDialogComponent } from './show-member-dialog/show-member-dialog.component';
import { UserDetailDialogComponent } from '../user-detail-dialog/user-detail-dialog.component';

@Component({
  selector: 'app-group-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './group-chat.component.html',
  styleUrl: './group-chat.component.scss',
})
export class GroupChatComponent {
  @Input() currentId!: string;
  chatService = inject(channelDataclientService);
  fireStoreService = inject(FirestoreService)
  currentChannelData: any;
  currentChat: any;
  message: any;
  yourMessage: any;
  currentUserId: any;

  
  constructor(public dialog: MatDialog, private route: ActivatedRoute, private elementRef: ElementRef) {
    this.getIdFromURL()
  }


  getIdFromURL() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.currentUserId = id;
    }
  }


  /**
   * This function checks if the id is changed by clicked on another channel in sidenav
   */
  async ngOnChanges(changes: SimpleChanges) {
    if (changes['currentId']) {
      await this.loadCurrentDatas();
    }
  }

  /**
   * This function download the channeldatas from the channelService per id.
   */
  async loadCurrentDatas() {
    try {
      const data = await this.chatService.getCurrentChannel(this.currentId);
      this.currentChannelData = data;
      console.log(this.currentChannelData);
    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error);
    }
    await this.loadCurrentChat()
  }


  async loadCurrentChat() {
    await this.chatService.getCurrentChats(this.currentId, this.currentUserId);
  }

  /**
   * open the edit dialog
   */
  openEditDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'transparent-dialog';
    dialogConfig.data = {
      channelId: this.currentChannelData.id,
      userId: this.currentUserId
    }
    this.dialog.open(EditGroupChannelDialogComponent, dialogConfig);
  }


  /**
   * send the message with the needed information to the chatservice and clears the textarea
   */
  sendMessage(channelId: string) {
    console.log(this.message, channelId);
    let timeStamp = Date.now().toString()

    this.chatService.sendChat(channelId, timeStamp, this.message, this.currentUserId)
    this.message = ''
  }


  getUserAvatar(userId: string): string {
    const user = this.currentChannelData.usersInChannel.find((user: any) => user.id === userId);
    return user ? user.avatar : 'assets/img/Logo.svg'; // Gib die Avatar-URL des Benutzers zurück, wenn er gefunden wurde
  }


  openShowMemberDialog(event: MouseEvent): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      channelData: this.currentChannelData
    }
    const offsetLeft = 400;
    const offsetY = 20;
    dialogConfig.position = { top: `${event.clientY + offsetY}px`, left: `${event.clientX - offsetLeft}px` };
    this.dialog.open(ShowMemberDialogComponent, dialogConfig);
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
