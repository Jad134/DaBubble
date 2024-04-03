import { Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCard } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from 'express';
import { User } from '../../../../models/user.class';
import { FirestoreService } from '../../../services/firestore.service';

@Component({
  selector: 'app-edit-profile-dialog',
  standalone: true,
  imports: [MatCard, FormsModule],
  templateUrl: './edit-profile-dialog.component.html',
  styleUrl: './edit-profile-dialog.component.scss',
})
export class EditProfileDialogComponent {
  constructor(private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data:any) {}

  firestoreService = inject(FirestoreService)
  userId: any;
  actualUser: any = new User;
  nameValue: string | undefined;
  mailValue: string | undefined;

  ngOnInit(){
    this.userId = this.data.userId;
    this.firestoreService.getUserDataById(this.userId).then((data) => {
      this.actualUser = new User(data);
      this.nameValue = this.actualUser.name;
      this.mailValue = this.actualUser.eMail;
    }).catch((error) =>{
      console.error('Fehler beim abrufen der Benutzerdaten: ', error);
    });
    // this.controlIfOwnPictureUsed(this.userId);
  }

  /**
   * close the dialog complete
   */
  close() {
    this.dialog.closeAll();
  }

  /**
   * save changed User data in DB and close the dialog
   */
  save(){
    this.actualUser.name = this.nameValue;
    this.actualUser.eMail = this.mailValue;
    this.firestoreService.updateUserNameAndMail(this.actualUser);
    this.dialog.closeAll();
  }
}
