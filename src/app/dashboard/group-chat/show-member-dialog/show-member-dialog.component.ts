import { Component, Inject } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-show-member-dialog',
  standalone: true,
  imports: [MatCard, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './show-member-dialog.component.html',
  styleUrl: './show-member-dialog.component.scss'
})
export class ShowMemberDialogComponent {
  constructor(private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) { }

  channelData: any;
  users: any;

  async ngOnInit() {
    this.channelData = this.data.channelData
    this.users = this.channelData.usersInChannel
  }


}
