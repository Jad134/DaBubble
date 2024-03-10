import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-select-avatar',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './select-avatar.component.html',
  styleUrl: './select-avatar.component.scss'
})
export class SelectAvatarComponent {

  name: string = "Tobias";

}
