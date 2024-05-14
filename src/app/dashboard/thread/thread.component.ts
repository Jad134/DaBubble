import { Component, HostListener, ViewChild, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { channelDataclientService } from '../../services/channelsDataclient.service';
import { ThreadService } from '../../services/thread.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { EmojiDialogComponent } from '../../emoji-dialog/emoji-dialog.component';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatIconModule, FormsModule],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {
  isSmallScreen: boolean = false;
  closeTab: boolean = false;
  chatService = inject(channelDataclientService);
  threadService = inject(ThreadService);
  currentUserId: any;
  message: any;
  showButton: boolean[] = Array(this.threadService.chatDatas.length).fill(false);
  currentChannelData: any;
  currentHoverEmoji: any;
  messageForEdit: any;
  imgForDelete: any;
  @ViewChild('reactionInformationDialog') reactionInfo: any;
  @ViewChild('editMessageDialog') editMessageDialog: any;
  dialogReference: MatDialogRef<any> | null = null;

  editedMessageIndex: number | null = null;


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }


  constructor(private route: ActivatedRoute, private dialog: MatDialog) {
    this.checkScreenSize();
    this.getIdFromURL();
    this.subscribeToCurrentChannelData();
  }


  private subscribeToCurrentChannelData(): void {
    this.threadService.currentChannelData$.subscribe(data => {
      if (data) {
        this.currentChannelData = data;
      }
    });
  }


  /**
   * This function get the id from the current logged in user from the url
   */
  getIdFromURL() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.currentUserId = id;
    }
  }


  checkScreenSize() {
    if (typeof window !== 'undefined') {
      this.isSmallScreen = window.innerWidth < 1305;
    }
  }


  Dnone() {
    this.threadService.closeTab = true;
  }


  /**
   * This function send the message to the threadservice and sets the timestamp as id
   */
  sendMessageToThread(message: any) {
    let timeStamp = Date.now().toString()
    this.threadService.sendMessageToThread(timeStamp, message, this.currentUserId)
    this.message = '';
  }


  openUserDetail(none: any) {

  }


  getUserAvatar(userId: string): string {
    if (this.currentChannelData && this.currentChannelData.usersInChannel) {
      const user = this.currentChannelData.usersInChannel.find((user: any) => user.id === userId);
      return user ? user.avatar : 'assets/img/Logo.svg';
    } else {
      return 'assets/img/Logo.svg'; // Fallback, wenn currentChannelData oder usersInChannel nicht definiert ist
    }
  }

  /**
* open the emojiDialog and insert the returned emoji in the textarea field
*/
  openEmojiDialog(event: MouseEvent, addEmojiToTextArea: boolean, addEmojiReaction: boolean, messageId?: any, emojiToEditMessage?: boolean) {
    const offsetY = 300;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = { top: `${event.clientY - offsetY}px`, left: `${event.clientX}px` };
    dialogConfig.backdropClass = 'cdk-overlay-transparent-backdrop';

    this.dialog.open(EmojiDialogComponent, dialogConfig).afterClosed().subscribe((selectedEmoji: string | undefined) => {
      if (selectedEmoji && addEmojiToTextArea) {
        if (emojiToEditMessage) {
          this.addEmojitoEditMessageTextArea(selectedEmoji)
        } else if (!emojiToEditMessage) {
          this.addEmojitoAnswerMessageTextArea(selectedEmoji)
        }
      }
      if (selectedEmoji && addEmojiReaction) {
        this.threadService.addEmojiToMessage(messageId, selectedEmoji, this.currentUserId)
      }
    });
  }


  addEmojitoEditMessageTextArea(selectedEmoji: any) {
    const textarea = document.getElementById('edit-message') as HTMLTextAreaElement;
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


  addEmojitoAnswerMessageTextArea(selectedEmoji: any) {
    const textarea = document.getElementById('answerThread') as HTMLTextAreaElement;
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



  addQuickReaction(thumbsUp: boolean, thumbsDown: boolean, messageId: any) {
    let selectedEmoji: string;
    if (thumbsUp) {
      selectedEmoji = "👍"
      this.threadService.addEmojiToMessage(messageId, selectedEmoji, this.currentUserId)
    } else if (thumbsDown) {
      selectedEmoji = "👎"; // Daumen runter Emoji
      this.threadService.addEmojiToMessage(messageId, selectedEmoji, this.currentUserId)
    }
  }

  addCurrentReaction(messageId: any, selectedEmoji: any) {
    this.threadService.addEmojiToMessage(messageId, selectedEmoji, this.currentUserId)
  }


  openReactionDialog(event: MouseEvent, emoji: any) {
    this.currentHoverEmoji = emoji; // Speichere die ausgewählte Emoji-Option
    if (!this.dialogReference) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.hasBackdrop = false;
      dialogConfig.autoFocus = false;
      dialogConfig.disableClose = true;
      dialogConfig.backdropClass = 'cdk-overlay-transparent-backdrop'
      this.setOpenReactionDialogPosition(event, dialogConfig)
      this.dialogReference = this.dialog.open(this.reactionInfo, dialogConfig);

      this.dialogReference.afterClosed().subscribe(() => {
        this.dialogReference = null; // Setzen Sie this.dialogReference auf null, wenn der Dialog geschlossen wurde
      });
    }
  }


  /**
   * This function returns the position of the mouseclick
   * @param event mouseclick
   * @returns position of the mouseclick
   */
  setOpenReactionDialogPosition(event: MouseEvent, dialogConfig: MatDialogConfig<any>,) {
    const offsetLeft = 0;
    const offsetY = 125;
    return dialogConfig.position = { top: `${event.clientY - offsetY}px`, left: `${event.clientX - offsetLeft}px` };
  }


  closeReactionDialog() {
    if (this.dialogReference) {
      this.dialogReference.close();
    }
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
   * This function sets the showbutton variable to true with timeout, because the (mouseleave) sets the variable with delay of false. Its for the
   * design when dialog edit message is open the hover effect doesnt go away
   * @param i index of message 
   */
  dontLeaveHover(i: number) {
    setTimeout(() => {
      this.showButton[i] = true;
    }, 3);
  }


  /**
   * This function returns the position of the mouseclick
   * @param event mouseclick
   * @returns position of the mouseclick
   */
  setEditMessageDialogPosition(event: MouseEvent, dialogConfig: MatDialogConfig<any>,) {
    const offsetLeft = 0;
    const offsetY = 0;
    return dialogConfig.position = { top: `${event.clientY + offsetY}px`, left: `${event.clientX - offsetLeft}px` };
  }


  deleteImg() {
    this.imgForDelete = ''
  }


  cancelEdit() {
    this.editedMessageIndex = null;
  }


  async saveEdit(messageId: any, message: any,) {
    await this.threadService.editMessage(messageId, message)
    this.editedMessageIndex = null;
  }

  async editMessage(messageId: any, messageIndex: number) {
    let message = await this.threadService.getMessageForEdit(messageId)

    // let img = await this.chatService.getImgForDelete(this.currentId, messageId)
    console.log(message);
    this.editedMessageIndex = messageIndex;
    this.messageForEdit = message;
    // this.imgForDelete = img;
    this.dialogReference?.close()
  }

  onEnterPressed(event:any): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      // Enter-Taste wurde gedrückt und Shift-Taste nicht gehalten
      this.sendMessageToThread(this.message);
      event.preventDefault(); // Verhindert einen Zeilenumbruch im Textfeld
    }
  }
}
