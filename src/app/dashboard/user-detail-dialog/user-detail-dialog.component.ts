import { Component, ElementRef, Inject, ViewChild, inject } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FirestoreService } from '../../services/firestore.service';
import { StorageService } from '../../services/storage.service';
import { User } from '../../../models/user.class';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-detail-dialog',
  standalone: true,
  imports: [MatCard, CommonModule],
  templateUrl: './user-detail-dialog.component.html',
  styleUrl: './user-detail-dialog.component.scss'
})
export class UserDetailDialogComponent {
  constructor(private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data:any) {}
  firestoreService = inject(FirestoreService)
  downloadService = inject(StorageService)

  userId = this.data.id;
  actualUser: any = new User;
  @ViewChild('profilePicture') profilePicture!: ElementRef;



  async ngOnInit() {
    this.userId = this.data.userId;
    await this.firestoreService.getUserDataById(this.userId).then((data) => {
      this.actualUser = new User(data);
    }).catch((error) => {
      console.error('Fehler beim abrufen der Benutzerdaten: ', error);
    });
    this.controlIfOwnPictureUsed(this.userId);
  }

  /**
   * checks if user profile is a personal uploaded picture and download it from Firestore
   * @param userID 
   */
  async controlIfOwnPictureUsed(userID: any) {
    if (this.actualUser.avatar === 'ownPictureDA') {
      await this.downloadService.downloadAvatar(userID);
    } else if (this.profilePicture && this.profilePicture.nativeElement) {
      this.profilePicture.nativeElement.src = this.actualUser.avatar;
    } else {
      console.error('Das Bild-Element wurde nicht richtig initialisiert.');
    }
  }

  close(){
    this.dialog.closeAll();
  }

  sendMessage(){
    console.log("Nachricht Button wurde gedrückt.")
  }
}
