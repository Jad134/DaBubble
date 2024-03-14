
import { Injectable, inject, NgZone } from '@angular/core';
import { Firestore, getDoc, getFirestore, } from '@angular/fire/firestore';
import { initializeApp } from '@angular/fire/app';
import { getAuth, signInWithEmailAndPassword, signInWithPopup } from '@angular/fire/auth';
import { GoogleAuthProvider } from '@angular/fire/auth'
import { Router } from '@angular/router';
import { User } from '../../models/user.class';
import { doc, setDoc } from "firebase/firestore";
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
      const userDoc = await getDoc(doc(this.db, "Users", userId));
      const userData = this.setUserData(user);

      this.checkUserStatus(userDoc, userId, userData);
    } catch (error) {
      console.error('Fehler beim Anmelden mit Google:', error);
    }
  }


  checkUserStatus(userDoc: any, userId: any, userData: any) {
    if (userDoc.exists()) {
      this.routeToDashboard(userId)
    } else {
      this.routeToAvatarPage(userId, userData)
    }
  }


  setUserData(user: any) {
    return {
      name: user.displayName,
      email: user.email,
      avatar: '',
    };
  }


  routeToDashboard(userId: any) {
    this.ngZone.run(() => {
      this.router.navigate(['/dashboard/' + userId]);
    });
  }

  
  async routeToAvatarPage(userId: any, userData: any) {
    await setDoc(doc(this.db, "Users", userId), userData); // Benutzerdaten erstellen
    this.ngZone.run(() => {
      this.router.navigate(['/select-avatar/' + userId]);
    });
  }
}
