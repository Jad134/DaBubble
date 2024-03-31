import { Component, ViewChild, ElementRef, HostListener, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
/* import { PickerModule } from '@ctrl/ngx-emoji-mart' */
import { ThreadComponent } from '../thread/thread.component';
import { channelDataclientService } from '../../services/channelsDataclient.service';

channelDataclientService
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
  channels:any;
  testChannel: any;
  channelService = inject(channelDataclientService)
  @ViewChild('emojiPicker') emojiPicker!: ElementRef;

  ngOnInit(): void {
    this.getAllChannels();
  }

  async getAllChannels() {
    try {
      this.channels = await this.channelService.getAllChannels(); // Warten Sie, bis die Daten zurückgegeben werden
      this.testChannel = this.channels[0];
      console.log(this.testChannel);
    } catch (error) {
      console.error('Fehler beim Abrufen der Kanäle: ', error);
    }
  }

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
      if(typeof window !== 'undefined'){
      this.isSmallScreen = window.innerWidth < 770;
      }
    }
  
    openThread() {
      if (this.threadComponent) {
        this.threadComponent.closeTab = false;
      } else {
        console.error('threadComponent wurde nicht gefunden oder nicht initialisiert.');
      }
    }
}
