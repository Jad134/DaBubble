import { Component, Inject } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from 'express';

@Component({
  selector: 'app-edit-profile-dialog',
  standalone: true,
  imports: [MatCard],
  templateUrl: './edit-profile-dialog.component.html',
  styleUrl: './edit-profile-dialog.component.scss',
})
export class EditProfileDialogComponent {
  constructor(private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data:any) {}

  /**
   * close the dialog complete
   */
  close() {
    this.dialog.closeAll();
  }
}
