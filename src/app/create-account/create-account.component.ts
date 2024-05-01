import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { User } from '../../models/user.class';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../services/firestore.service';
import { CreateAccountService } from '../services/create-account.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [MatCardModule, FormsModule, CommonModule, RouterModule],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss',
})
export class CreateAccountComponent {
  createAccountService = inject(CreateAccountService);
  newUser = new User();
  nameFailed = false;
  mailFailed = false;
  pswFailed = false;
  dataprotectionFailed = false;
  isAgreed!: boolean;

  /**
   * Create a user and save in db
   */
  createAccount() {
    if (
      this.checkNameInputNotEmpty() &&
      this.checkIfCorrectMailFormat() &&
      this.checkCorrectPasswordFormat() &&
      this.checkDataprotectionIsSet()
    ) {
      this.createAccountService.createUserWithEmailAndPassword(
        this.newUser.eMail,
        this.newUser.password,
        this.newUser
      ); 
    }
  }

  /**
   * validate name is not empty
   */
  checkNameInputNotEmpty() {
    this.nameFailed = this.newUser.name.length <= 4;
    return !this.nameFailed;
  }

  /**
   * validate email is not empty
   */
  checkIfCorrectMailFormat() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    this.mailFailed = !(
      this.newUser.eMail.match(emailPattern) && this.newUser.eMail.length > 6
    );
    return !this.mailFailed;
  }

  /**
   * validate password is not empty and longer than 7 characters
   */
  checkCorrectPasswordFormat() {
    this.pswFailed = this.newUser.password.length < 8;
    return !this.pswFailed;
  }

  /**
   * validate dataprotection button is set
   */
  checkDataprotectionIsSet() {
    this.dataprotectionFailed = !this.isAgreed;
    return !this.dataprotectionFailed;
  }
}
