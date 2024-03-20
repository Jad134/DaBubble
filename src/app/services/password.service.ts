import { Injectable, inject } from '@angular/core';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  firestore = inject(FirestoreService);
  newPassword!: string;
  constructor() { }

  // updatePassword() {
    
  //   confirmPasswordReset(this.auth, code, newPassword)
  //     .then(function () {
  //       // Success
  //     })
  //     .catch(function () {
  //       // Invalid code
  //     })
  // }
}
