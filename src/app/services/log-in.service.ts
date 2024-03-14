
import { Injectable, Component, inject, NgZone } from '@angular/core';
import { Firestore, getDoc, getFirestore, onSnapshot } from '@angular/fire/firestore';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential, signInWithPopup, signInWithRedirect, sendPasswordResetEmail } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Auth, GoogleAuthProvider } from '@angular/fire/auth'
import { Router } from '@angular/router';
import { routes } from '../app.routes';
import { User } from '../../models/user.class';
import { doc, setDoc, collection, updateDoc } from "firebase/firestore";
import { FirestoreService } from './firestore.service';


@Injectable({
  providedIn: 'root'
})
export class LogInService {
  constructor(private router: Router, public ngZone: NgZone) { }

  firestoreService = inject(FirestoreService)
  firestore: Firestore = inject(Firestore)
  app = initializeApp(this.firestoreService.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore(this.app)
  users = new User;

  logInInvalid = false;

  //-- ----------------------------------- ---Anmelden--------------------------------------------
  // https://www.linkedin.com/pulse/angular-14-firebase-authentication-tutorial-attia-imed/ daraus kommt die anmlede funktion


  async Login(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      const user = result.user;
      let userid = user.uid;
      this.ngZone.run(() => {
        this.router.navigate(['/dashboard/' + userid]);
        console.log(userid);

        this.logInInvalid = false;
      });
    } catch (error) {
      window.alert('error, anmelden geht nicht');
      this.logInInvalid = true;
    }
  }



  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);
      const user = userCredential.user;
      const userId = user.uid;
  
      // Überprüfen, ob der Benutzer bereits existiert
      const userDoc = await getDoc(doc(this.db, "Users", userId));
      const userData = {
        name: user.displayName,
        email: user.email,
        avatar: '',
      };
  
      if (userDoc.exists()) {
        // Der Benutzer existiert bereits, leiten Sie ihn zur Dashboard-Seite weiter
        this.ngZone.run(() => {
          this.router.navigate(['/dashboard/' + userId]);
        });
      } else {
        // Der Benutzer existiert noch nicht, leiten Sie ihn zur Avatar-Auswahl-Seite weiter
        await setDoc(doc(this.db, "Users", userId), userData); // Benutzerdaten erstellen
        this.ngZone.run(() => {
          this.router.navigate(['/select-avatar/' + userId]);
        });
      }
    } catch (error) {
      console.error('Fehler beim Anmelden mit Google:', error);
    }
  }


}
