import { Component, HostListener, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { channelDataclientService } from '../../services/channelsDataclient.service';
import { ThreadService } from '../../services/thread.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
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
  currentChannelData:any;


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
      this.isSmallScreen = window.innerWidth < 1200;
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
