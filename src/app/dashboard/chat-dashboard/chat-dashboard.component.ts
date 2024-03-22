import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
@Component({
  selector: 'app-chat-dashboard',
  standalone: true,
  imports: [MatIconModule,MatButtonModule],
  templateUrl: './chat-dashboard.component.html',
  styleUrl: './chat-dashboard.component.scss'
})
export class ChatDashboardComponent {
  color: boolean = false;
}
