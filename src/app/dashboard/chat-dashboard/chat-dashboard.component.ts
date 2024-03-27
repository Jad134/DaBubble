import { Component, ViewChild, ElementRef, HostListener} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
/* import { PickerModule } from '@ctrl/ngx-emoji-mart' */
import { ThreadComponent } from '../thread/thread.component';
@Component({
  selector: 'app-chat-dashboard',
  standalone: true,
  imports: [MatIconModule, MatButtonModule,CommonModule],
  templateUrl: './chat-dashboard.component.html',
  styleUrl: './chat-dashboard.component.scss'
})
export class ChatDashboardComponent {
  color: boolean = false;
  isSmallScreen: boolean = false;
  @ViewChild('emojiPicker') emojiPicker!: ElementRef;

  addEmoji(event: any) {
    // Implementiere hier die Logik zum Hinzufügen des ausgewählten Emojis
    console.log('Ausgewähltes Emoji:', event);
    // Beispiel: Fügen Sie das Emoji zum Eingabefeld hinzu
  }

  openEmojiPicker(){
   
  }

  @ViewChild(ThreadComponent) threadComponent!: ThreadComponent;
  
    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
      this.checkScreenSize();
    }
  
    constructor() {
      this.checkScreenSize();
    }
  
    checkScreenSize() {
      this.isSmallScreen = window.innerWidth < 770;
    }
  
    openThread() {
      if (this.threadComponent) {
        this.threadComponent.closeTab = false;
      } else {
        console.error('threadComponent wurde nicht gefunden oder nicht initialisiert.');
      }
    }
}
