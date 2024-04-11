import { Component, Inject, inject } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FirestoreService } from '../../../services/firestore.service';
import { channelDataclientService } from '../../../services/channelsDataclient.service';

@Component({
  selector: 'app-edit-group-channel-dialog',
  standalone: true,
  imports: [MatCard],
  templateUrl: './edit-group-channel-dialog.component.html',
  styleUrl: './edit-group-channel-dialog.component.scss'
})
export class EditGroupChannelDialogComponent {
  constructor(private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) { }

  channelId!: string;
  currentChannelData!: any;
  firestoreService = inject(FirestoreService)
  channelsDataclientService = inject(channelDataclientService)
  name!:string;
  description!: string;


  async ngOnInit() {
    this.channelId = this.data.channelId;
    await this.loadCurrentDatas();
    console.log("Aktueller Channel ist: ", this.currentChannelData);
    this.name = this.currentChannelData.name;
    this.description = this.currentChannelData.description;

  }

    /**
   * This function download the channeldatas from the channelService per id.
   */
    async loadCurrentDatas() {
      try {
        const data = await this.channelsDataclientService.getCurrentChannel(this.channelId);
        this.currentChannelData = data;
      } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
      }
    }


  close(){
    this.dialog.closeAll();
  }
}
