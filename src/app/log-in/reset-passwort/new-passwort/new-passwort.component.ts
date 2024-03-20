import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FirestoreService } from '../../../services/firestore.service';
import { PasswordService } from '../../../services/password.service';

@Component({
  selector: 'app-new-passwort',
  standalone: true,
  imports: [MatCardModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './new-passwort.component.html',
  styleUrl: './new-passwort.component.scss'
})
export class NewPasswortComponent {
  constructor() { }
  firestore = inject(FirestoreService);
 passwordService = inject(PasswordService)
  newPassword: any;
  
  

  @ViewChild('passwordInput') passwordInput!: ElementRef;
  @ViewChild('passwordInputControl') passwordInputControl!: ElementRef;
  @ViewChild('sendPasswordBtn') sendPasswordBtn!: ElementRef;
  @ViewChild('notSimilarMessage') notSimilarMessage!: ElementRef



  controlPasswords() {
    if (this.passwordInput && this.passwordInputControl && this.sendPasswordBtn) {
      let btn = this.sendPasswordBtn.nativeElement;
      let input1 = this.passwordInput.nativeElement.value;
      let input2 = this.passwordInputControl.nativeElement.value;
      let errorMessage = this.notSimilarMessage.nativeElement;

      if (input1 === input2) {
        btn.disabled = false;
        errorMessage.style = 'opacity: 0;'
        input2 = this.newPassword;
      } else {
        btn.disabled = true;
        errorMessage.style = 'opacity: 1;'
        input2 = '';
      }
    }
  }

  
}

