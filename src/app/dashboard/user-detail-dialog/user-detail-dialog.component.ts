import { Component, ElementRef, Inject, ViewChild, inject } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FirestoreService } from '../../services/firestore.service';
import { StorageService } from '../../services/storage.service';
import { User } from '../../../models/user.class';
import { CommonModule } from '@angular/common';
import { SharedServiceService } from '../../services/shared-service.service';
import { user } from '@angular/fire/auth';

@Component({
  selector: 'app-user-detail-dialog',
  standalone: true,
  imports: [MatCard, CommonModule],
  templateUrl: './user-detail-dialog.component.html',
  styleUrl: './user-detail-dialog.component.scss'
})
export class UserDetailDialogComponent {
  constructor(private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data:any, private sharedService: SharedServiceService) {}
  firestoreService = inject(FirestoreService)
  downloadService = inject(StorageService)

  userId = this.data.user.id;
  actualUser: any = new User;
  usersInChannel: User[] = [new User]
  @ViewChild('profilePicture1') profilePicture1!: ElementRef;

  async ngOnInit() {
    this.userId = this.data.user.id;
    this.usersInChannel = this.data.userInChannel.usersInChannel;
    console.log("Aktuller User- User Dialog: ", this.actualUser, this.userId);
    console.log(this.usersInChannel)
    this.usersInChannel.forEach(user => {
      if(user.id === this.userId){
        this.actualUser = user;
      }else{
        console.info("User nicht gefunden");
      } 
    });
    // this.userId = this.data.userId;
    // await this.firestoreService.getUserDataById(this.userId).then((data) => {
    //   this.actualUser = new User(data);
    // }).catch((error) => {
    //   console.error('Fehler beim abrufen der Benutzerdaten: ', error);
    // });
  }
  
  /**
   * closed the dialog
   */
  close(){
    this.dialog.closeAll();
  }

  /**
   * open the direct chat with the choosen userId
   */
  sendMessage(){
    console.log("Nachricht Button wurde gedrückt.");
    this.sharedService.setSelectedUserId(this.userId);
    this.close();
  }
}
