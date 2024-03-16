import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FirestoreService } from '../services/firestore.service';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { User } from '../../models/user.class';
import { doc, onSnapshot } from '@angular/fire/firestore';
import { error } from 'console';
import { user } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-select-avatar',
  standalone: true,
  imports: [MatCardModule, RouterModule, CommonModule],
  templateUrl: './select-avatar.component.html',
  styleUrl: './select-avatar.component.scss',
})
export class SelectAvatarComponent {
  uploadService = inject(StorageService)
  firestore = inject(FirestoreService);
  userId = '';
  actualUser: any;
  name!: string;
  avatar: any | string = 'assets/img/avatars/profile-blank.svg';
  selectSucceed: boolean = false;


  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getIdFromURL();
    this.firestore
      .getUserDataById(this.userId)
      .then((data) => {
        this.actualUser = new User(data);
        console.log(this.actualUser);

        if (this.actualUser) {
          this.name = this.actualUser.name;
          this.showAvatar();
        }
      })
      .catch((error) => {
        console.log('Fehler beim Laden des Benutzers: ', error);
      });
  }

  /**
   * read UserID from the Url.
   */
  getIdFromURL() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.userId = id;
    }
  }

  /**
   * save the avatar picture name in the varialbe avatar, which show it in the html form.
   */
  showAvatar() {
    if (this.actualUser.avatar) {
      this.avatar = this.actualUser.avatar;
    }
  }

  /**
   * change the avatar picture name by click
   * @param event html id
   */
  selectNewAvatar(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    const id = clickedElement.id;
    this.avatar = id;
    this.actualUser.avatar = id;
  }

  /**
   * save selected Avatar to Firestore DB and redirect to the login
   */
  updateAvatar() {
    this.uploadService.uploadImg();
    this.selectSucceed = true;
    this.firestore.updateUser(this.userId, this.avatar);

    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1500);

  }


  uploadOwnAvatar(event: any) {
    this.uploadService.avatarSelected(event, this.userId);
    this.ownPicturePreView(event);
  }


  ownPicturePreView(event: any) {
    const file = event.target.files[0]; // Zugriff auf das ausgewählte Bild
    // Überprüfe, ob eine Datei ausgewählt wurde und ob es sich um ein Bild handelt
    if (file && file.type.startsWith('image')) {
      const reader = new FileReader(); // Erstelle ein FileReader-Objekt
      // Definiere eine Funktion, die aufgerufen wird, wenn das Bild geladen wurde
      reader.onload = () => {
        // Weise den Inhalt des Bildes der avatar-Variable zu
        this.avatar = reader.result;
      };
      reader.readAsDataURL(file); // Lese das Bild als Daten-URL
    }
  }
}
