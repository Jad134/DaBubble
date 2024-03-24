import { Component, inject } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatDialog, MatDialogActions, MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
import { LogInService } from '../../../services/log-in.service';
import {  Router } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-user-menu-dialog',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton, MatButtonModule, MatDialogModule, MatCard],
  templateUrl: './user-menu-dialog.component.html',
  styleUrl: './user-menu-dialog.component.scss'
})
export class UserMenuDialogComponent {
  constructor( private router: Router, private dialog: MatDialog){}
  logOutService = inject(LogInService)


  logOut(){
    this.logOutService.logOut();
    setTimeout(() => {
      this.dialog.closeAll();
      this.router.navigate(['/']);
    }, 1500);
  }
}
