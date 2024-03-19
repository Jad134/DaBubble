import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, RouterModule, Router, } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { FirestoreService } from '../../services/firestore.service';
import { log } from 'console';
import { User } from '../../../models/user.class';

@Component({
  selector: 'app-head-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './head-dashboard.component.html',
  styleUrl: './head-dashboard.component.scss'
})
export class HeadDashboardComponent {
  firestoreService = inject(FirestoreService)
  downloadService = inject(StorageService)
  userId = '';
  actualUser: any;
  name: any;
  @ViewChild('profilePicture') profilePicture!: ElementRef;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getIdFromURL();
    this.downloadProfileDatas(this.userId);
  }


  /**
     * read UserID from the Url.
     */
  getIdFromURL() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.userId = id;
    }
    console.log('die id ist:', this.userId);
  }


  async downloadProfileDatas(userID: any) {
   await this.firestoreService
       .getUserDataById(this.userId)
      .then((data) => {
        this.actualUser = new User(data);
        console.log(this.actualUser.avatar);
        if (this.actualUser) {
          this.name = this.actualUser.name;
        }
      })
      .catch((error) => {
        console.log('Fehler beim Laden des Benutzers: ', error);
      });
      this.controlIfOwnPictureUsed(this.userId)  
  }



  controlIfOwnPictureUsed(userID:any){
    if (this.actualUser.avatar === 'ownPictureDA'){
      this.downloadService.downloadAvatar(userID);
    }else if (this.profilePicture && this.profilePicture.nativeElement) {
      this.profilePicture.nativeElement.src = this.actualUser.avatar;
    } else {
      console.error('Das Bild-Element wurde nicht richtig initialisiert.');
    }
  }
}


