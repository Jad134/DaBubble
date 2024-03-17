import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { StartPageComponent } from '../start-page/start-page.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [MatCardModule, StartPageComponent, MatIconModule, RouterModule],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss',
})
export class ImprintComponent {}
