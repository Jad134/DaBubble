import { Component, Input, Inject, inject, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { channelDataclientService } from '../../services/channelsDataclient.service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogConfig, MatDialogClose, MatDialogRef, } from '@angular/material/dialog';
import { EditGroupChannelDialogComponent } from './edit-group-channel-dialog/edit-group-channel-dialog.component';
import { FormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';
import { ShowMemberDialogComponent } from './show-member-dialog/show-member-dialog.component';
import { UserDetailDialogComponent } from '../user-detail-dialog/user-detail-dialog.component';
import { User } from '../../../models/user.class';
import { MatIconModule } from '@angular/material/icon';
import { ThreadService } from '../../services/thread.service';
import { EmojiDialogComponent } from '../../emoji-dialog/emoji-dialog.component';


@Component({
  selector: 'app-group-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogClose, MatIconModule],
  templateUrl: './group-chat.component.html',
  styleUrl: './group-chat.component.scss',
})
export class GroupChatComponent {
  @Input() currentId!: string;
  chatService = inject(channelDataclientService);
  fireStoreService = inject(FirestoreService);
  threadService = inject(ThreadService);
  currentChannelData: any;
  currentChat: any;
  message: any;
  yourMessage: any;
  currentUserId: any;
  @Input() users: User[] = [];
  showButton: boolean[] = Array(this.chatService.chatDatas.length).fill(false);
  @ViewChild('editMessageDialog') editMessageDialog: any;
  dialogReference: MatDialogRef<any> | null = null;
  editedMessageIndex: number | null = null;
  messageForEdit: any;


  constructor(public dialog: MatDialog, private route: ActivatedRoute, private elementRef: ElementRef, ) {
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
    if (this.currentChannelData && this.currentChannelData.usersInChannel) {
      const user = this.currentChannelData.usersInChannel.find((user: any) => user.id === userId);
      return user ? user.avatar : 'assets/img/Logo.svg';
    } else {
      return 'assets/img/Logo.svg'; // Fallback, wenn currentChannelData oder usersInChannel nicht definiert ist
    }
  }


  openShowMemberDialog(event: MouseEvent, showMember: boolean, addMember: boolean): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      channelData: this.currentChannelData,
      allUsers: this.users,
      mouseEventData: {
        clientX: event.clientX,
        clientY: event.clientY
      },
      showMemberSection: showMember, // Hier wird der Zustand für showMemberSection gesetzt
      addMemberSection: addMember // Hier wird der Zustand für addMemberSection ge
    }
    const offsetLeft = 400;
    const offsetY = 20;
    dialogConfig.position = { top: `${event.clientY + offsetY}px`, left: `${event.clientX - offsetLeft}px` };
    this.dialog.open(ShowMemberDialogComponent, dialogConfig);
  }


  openAddUserDialog(event: MouseEvent): void {
    this.openShowMemberDialog(event, false, true)
  }

  /**
     * open the user detail dialog
     */
  openUserDetail(user: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      top: '100px',
      right: '20px'
    };
    dialogConfig.panelClass = 'transparent-dialog';
    dialogConfig.data = {
      user: user,
      userInChannel: this.currentChannelData,
    }
    this.dialog.open(UserDetailDialogComponent, dialogConfig);
  }


  openThread(messageId: any) {
    console.log(messageId);
    this.threadService.closeTab = false;
    this.threadService.currentChatId = messageId;
    this.threadService.currentGroupId = this.currentId
    this.threadService.getCurrentThreadCollection(this.currentId, messageId, this.currentUserId)
    this.threadService.setCurrentChannelData(this.currentChannelData)
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
    let message = await this.chatService.getMessageForEdit(this.currentId, messageId)
    console.log(message);
    this.editedMessageIndex = messageIndex;
    this.messageForEdit = message;
    this.dialogReference?.close()
  }


  cancelEdit() {
    this.editedMessageIndex = null;
  }


  async saveEdit(messageId: any, message: any) {
    await this.chatService.editMessage(this.currentId, messageId, message)
    this.editedMessageIndex = null;
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

}
