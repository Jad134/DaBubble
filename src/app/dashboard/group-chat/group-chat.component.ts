import { Component, Input, Inject, inject, SimpleChanges } from '@angular/core';
import { channelDataclientService } from '../../services/channelsDataclient.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-group-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './group-chat.component.html',
  styleUrl: './group-chat.component.scss'
})
export class GroupChatComponent {
  @Input() currentId!: string;
  chatService = inject(channelDataclientService)
  currentChannelData: any;

  
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
}
}
