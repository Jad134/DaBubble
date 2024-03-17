import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { StartPageComponent } from '../start-page/start-page.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dataprotection',
  standalone: true,
  imports: [RouterModule, StartPageComponent, MatCardModule, MatIconModule],
  templateUrl: './dataprotection.component.html',
  styleUrl: './dataprotection.component.scss',
})
export class DataprotectionComponent {}
