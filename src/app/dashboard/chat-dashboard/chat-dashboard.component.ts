import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PickerModule } from '@ctrl/ngx-emoji-mart'
@Component({
  selector: 'app-chat-dashboard',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, PickerModule],
  templateUrl: './chat-dashboard.component.html',
  styleUrl: './chat-dashboard.component.scss'
})
export class ChatDashboardComponent {
  color: boolean = false;
  @ViewChild('emojiPicker') emojiPicker!: ElementRef;

  addEmoji(event: any) {
    // Implementiere hier die Logik zum Hinzufügen des ausgewählten Emojis
    console.log('Ausgewähltes Emoji:', event);
    // Beispiel: Fügen Sie das Emoji zum Eingabefeld hinzu
  }

  openEmojiPicker(){
   
  }
}
