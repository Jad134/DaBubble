import { Component } from '@angular/core';
import { IntroComponent } from './intro/intro.component';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [IntroComponent, MatCardModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {

}
