import { Component, Input, SimpleChanges, inject } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-direct-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './direct-chat.component.html',
  styleUrl: './direct-chat.component.scss'
})
export class DirectChatComponent {
  @Input() currentId!: string;
  fireStoreService = inject(FirestoreService)
  downloadService = inject(StorageService);
  currentUserData: any;
  
  


  async ngOnChanges(changes: SimpleChanges) {
    if (changes['currentId']) {
      await this.loadCurrentDatas();
    }
  }

  async loadCurrentDatas() {
    try {
      const data = await this.fireStoreService.getUserDataById(this.currentId);
      this.currentUserData = data;
      console.log(this.currentUserData);

    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error);
    }
  }
}
