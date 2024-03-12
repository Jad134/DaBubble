import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { User } from '../../models/user.class';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [MatCardModule, FormsModule, CommonModule],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss',
})
export class CreateAccountComponent {
  firestore = inject(FirestoreService)
  newUser = new User();
  nameFailed = false;
  mailFailed = false;
  pswFailed = false;

  createAccount() {
    if (this.checkNameInputNotEmpty()) {
      console.log(this.newUser.name);
    }
    if (this.checkIfCorrectMailFormat()) {
      console.log(this.newUser.eMail);
    }
    if (this.checkCorrectPasswordFormat()) {
      console.log(this.newUser.password);
      
      this.firestore.createUserWithEmailAndPassword(this.newUser.eMail, this.newUser.password, this.newUser) // Testweise die funktion zum erstellen der user und übergabe der daten implementiert
    }
  }

  checkNameInputNotEmpty() {
    this.nameFailed = this.newUser.name.length <= 4;
    return !this.nameFailed;
  }

  checkIfCorrectMailFormat() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    this.mailFailed = !(
      this.newUser.eMail.match(emailPattern) && this.newUser.eMail.length > 6
    );
    return !this.mailFailed;
  }

  checkCorrectPasswordFormat() {
    this.pswFailed = this.newUser.password.length < 8;
    return !this.pswFailed;
  }
}
