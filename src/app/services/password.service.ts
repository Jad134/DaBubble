import { Injectable, inject } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { ActivatedRoute } from '@angular/router';
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  firestore = inject(FirestoreService);
  newPassword!: string;
  actionCode = this.getParameterByName('oobCode');
  continueUrl = this.getParameterByName('continueUrl');
  lang = this.getParameterByName('lang') || 'en';
  constructor(private route: ActivatedRoute) { }

  getParameterByName(name: string): string | null {
    return this.route.snapshot.queryParamMap.get(name) || null;
  }

  updatePassword(code: any, newPassword: any) {
    console.log(code, newPassword);

    confirmPasswordReset(this.firestore.auth, code, newPassword)
      .then(function () {
        console.log('gesendet');

      })
      .catch(function () {
        // Invalid code
      })
  }
}
