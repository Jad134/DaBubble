import { Component, ViewChild, ElementRef } from '@angular/core';
import { IntroComponent } from './intro/intro.component';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [IntroComponent, MatCardModule, RouterModule, FormsModule, ReactiveFormsModule,],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {
  @ViewChild('mailField') mailField!: ElementRef;
  @ViewChild(' passwordMessage') passwordMessage!: ElementRef;




  logIn() {
    this.validateCheck()
    

  }

  validateCheck(){
    const mailfield = this.mailField.nativeElement;
    const passwordMessage = this.passwordMessage.nativeElement;

    if (!mailfield.validity.valid) {
      passwordMessage.style = 'opacity: 1'
    } else {
      passwordMessage.style = 'opacity: 0'
    }
  }
}
