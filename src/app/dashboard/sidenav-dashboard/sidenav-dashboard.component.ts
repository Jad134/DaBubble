import {
  Component,
  ElementRef,
  ViewChild,
  viewChild,
  Renderer2,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  state,
  trigger,
  animate,
  style,
  transition,
} from '@angular/animations';

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
  constructor(private renderer: Renderer2) {}

  channelsmenu: boolean = true;
  userMenu: boolean = true;

  togglechannelsMenu() {
    this.channelsmenu = !this.channelsmenu;
  }

  toggleUsersMenu() {
    this.userMenu = !this.userMenu;
  }
}
