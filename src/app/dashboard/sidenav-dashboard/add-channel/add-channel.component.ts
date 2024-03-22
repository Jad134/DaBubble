import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-add-channel',
  standalone: true,
  imports: [MatButton, MatIcon, CommonModule],
  templateUrl: './add-channel.component.html',
  styleUrl: './add-channel.component.scss',
})
export class AddChannelComponent {
  @Output() close = new EventEmitter<void>();
  userOverlay: boolean = false;

  closeOverlay() {
    this.close.emit();
  }

  toggleUserOverlay() {
    this.userOverlay = !this.userOverlay;
  }
}
