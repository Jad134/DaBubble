import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FirestoreService } from '../services/firestore.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.class';
import { doc, onSnapshot } from '@angular/fire/firestore';
import { error } from 'console';
import { user } from '@angular/fire/auth';

@Component({
  selector: 'app-select-avatar',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './select-avatar.component.html',
  styleUrl: './select-avatar.component.scss',
})
export class SelectAvatarComponent {
  firestore = inject(FirestoreService);
  userId = '';
  actualUser: any;
  name!: string;
  avatar: string = 'profile-blank.svg';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getIdFromURL();
    this.firestore
      .getUserDataById(this.userId)
      .then((data) => {
        this.actualUser = data;

        if (this.actualUser) {
          this.name = this.actualUser.name;
          console.log('Der Name lautet: ', this.name);
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
    console.log('Get id: ', this.userId);
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
  }
}
