import {
  Component,
  ElementRef,
  ViewChild,
  viewChild,
  Renderer2,
  inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  state,
  trigger,
  animate,
  style,
  transition,
} from '@angular/animations';
import { FirestoreService } from '../../services/firestore.service';
import { AllUser } from '../../../models/allUser.class';


@Component({
  selector: 'app-sidenav-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidenav-dashboard.component.html',
  styleUrl: './sidenav-dashboard.component.scss',
  animations: [
    trigger('menuVisibility', [
      state('visible', style({ opacity: 1, height: '*' })),
      state('hidden', style({ opacity: 0, height: '0px' })),
      transition('visible <=> hidden', [animate('200ms ease-in-out')]), // Adjust duration and timing as needed
    ]),
  ],
})
export class SidenavDashboardComponent {
  firestoreService = inject(FirestoreService)
  allUsers: AllUser[] = [];
  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.firestoreService.getAllUsers().then(users => {
      this.allUsers = users;
      console.log(this.allUsers); // Hier haben Sie Zugriff auf die heruntergeladenen Benutzerdaten
    }).catch(error => {
      console.error('Fehler beim Abrufen der Benutzerdaten:', error);
    });
  }

  channelsmenu: boolean = true;
  userMenu: boolean = true;

  togglechannelsMenu() {
    this.channelsmenu = !this.channelsmenu;
  }

  toggleUsersMenu() {
    this.userMenu = !this.userMenu;
  }
}
