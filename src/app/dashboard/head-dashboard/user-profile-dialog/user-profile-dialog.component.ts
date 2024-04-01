import { Component, ElementRef, Inject, ViewChild, inject } from '@angular/core';
import { user } from '@angular/fire/auth';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FirestoreService } from '../../../services/firestore.service';
import { User } from '../../../../models/user.class';
import { StorageService } from '../../../services/storage.service';
import { ElementSchemaRegistry } from '@angular/compiler';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { onSnapshot } from 'firebase/firestore';

@Component({
  selector: 'app-user-profile-dialog',
  standalone: true,
  imports: [MatCard, MatDialogContent, MatDialogActions, MatButton, MatButtonModule, MatDialogModule, MatDialogTitle, CommonModule],
  templateUrl: './user-profile-dialog.component.html',
  styleUrl: './user-profile-dialog.component.scss'
})
export class UserProfileDialogComponent {
  constructor( private router: Router, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data:any){}
  firestoreService = inject(FirestoreService)
  downloadService = inject(StorageService)
  userId: any;
  actualUser: any = new User;
  @ViewChild('profilePicture') profilePicture!: ElementRef;

  ngOnInit(){
    this.userId = this.data.userId;
    this.firestoreService.getUserDataById(this.userId).then((data) => {
      this.actualUser = new User(data);
    }).catch((error) =>{
      console.error('Fehler beim abrufen der Benutzerdaten: ', error);
    });
    this.controlIfOwnPictureUsed(this.userId);
  }

   /**
    * checks if user profile is a personal uploaded picture and download it from Firestore
    * @param userID 
    */
   async controlIfOwnPictureUsed(userID:any){
    if (this.actualUser.avatar === 'ownPictureDA'){
    await  this.downloadService.downloadAvatar(userID);
    }else if (this.profilePicture && this.profilePicture.nativeElement) {
      this.profilePicture.nativeElement.src = this.actualUser.avatar;
    } else {
      console.error('Das Bild-Element wurde nicht richtig initialisiert.');
    }
  }

  /**
   * close the dialog complete
   */
  close(){
    this.dialog.closeAll();
  }
}
