import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FirestoreService } from '../../services/firestore.service';
import { FormControl, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-passwort',
  standalone: true,
  imports: [MatCardModule, RouterModule, MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule,],
  templateUrl: './reset-passwort.component.html',
  styleUrl: './reset-passwort.component.scss'
})
export class ResetPasswortComponent {
  
  firestore = inject(FirestoreService)

 

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  sendMail() {
    const emailValue = this.emailFormControl.value;
    if (emailValue && this.emailFormControl.valid) {
      this.firestore.sendPasswordResetEmails(emailValue);
      console.log('E-Mail-Adresse gültig:', emailValue);
      // Hier können Sie den Code einfügen, um die E-Mail zu senden oder andere Aktionen durchzuführen
    } else {
      console.log('Ungültige E-Mail-Adresse');
    }
  }

  
}
