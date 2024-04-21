import { Component, ElementRef, Inject, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCard } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
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

  @ViewChild('profilePicture') profilePicture!: ElementRef;

 async ngOnInit(){
    this.actualUser = this.data.user;
    this.nameValue = this.actualUser.name;
    this.mailValue = this.actualUser.eMail;
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
