import { Component } from '@angular/core';
import { IntroComponent } from './intro/intro.component';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [IntroComponent],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {

}
