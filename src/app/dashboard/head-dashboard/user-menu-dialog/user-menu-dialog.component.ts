import { Component, inject } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatDialogActions, MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
import { LogInService } from '../../../services/log-in.service';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-user-menu-dialog',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton, MatButtonModule, MatDialogModule, MatCard],
  templateUrl: './user-menu-dialog.component.html',
  styleUrl: './user-menu-dialog.component.scss'
})
export class UserMenuDialogComponent {
  constructor( private router: Router){}
  logOutService = inject(LogInService)


  logOut(){
    this.logOutService.logOut();
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1500);
  }
}
