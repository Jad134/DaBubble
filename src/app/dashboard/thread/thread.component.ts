import { Component, HostListener } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [MatCardModule,CommonModule],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {
isSmallScreen: boolean = false;
  closeTab: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  constructor() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    if(window != undefined){
    this.isSmallScreen = window.innerWidth < 1200;
    }
  }

  Dnone(){
    this.closeTab = true;
  }
}
