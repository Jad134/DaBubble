import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { StartPageComponent } from '../start-page/start-page.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [MatCardModule, StartPageComponent, MatIconModule],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss',
})
export class ImprintComponent {}
