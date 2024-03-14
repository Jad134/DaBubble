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


@Injectable({
  providedIn: 'root'
})


export class FirestoreService {

  logInInvalid = false;

  firebaseConfig = {
    apiKey: "AIzaSyDiGmIlzMq2kQir6-xnHFX9iOXxH1Wcj8o",
    authDomain: "dabubble-51e17.firebaseapp.com",
    databaseURL: "https://dabubble-51e17-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "dabubble-51e17",
    storageBucket: "dabubble-51e17.appspot.com",
    messagingSenderId: "185514198211",
    appId: "1:185514198211:web:53ebf5cdc18b5567090e76",
    measurementId: "G-4HJ8MGXTCJ"
  };


  firestore: Firestore = inject(Firestore)
  app = initializeApp(this.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore(this.app)
  users = new User;


  constructor(private router: Router, public ngZone: NgZone) { }

  //----------------------------------------Create Account------------------------------------------
  async createUserWithEmailAndPassword(email: string, password: string, userDatas: any): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      let userid = user.uid
      // Erstellen Sie ein neues Dokument in der Firestore-Sammlung 'users'
      await setDoc(doc(this.db, "Users", userid), {
        name: userDatas.name,
        email: userDatas.eMail,
        avatar: userDatas.avatar,
      });

      // Weiterleitung zur Dashboard-Seite
      this.ngZone.run(() => {
        // Automatic forwarding to the Select Avatar component after successful creation of a new user
        this.router.navigate(['/select-avatar/' + userid]);
      });
    } catch (error) {
      console.error('Fehler beim Erstellen des Benutzers:', error);
    }
  }


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

  
  //Send Password Reset Email
  async sendPasswordResetEmails(email: string) {
    sendPasswordResetEmail(this.auth, email)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error.message);
      });
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


  async getUser(id: string) {
    const unsub = onSnapshot(doc(this.firestore, 'users', id), (doc) => {
      return doc.data();
    });
  }

  async getUserDataById(id: string) {
    try {
      const docRef = doc(this.db, 'Users', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log('Kein Dokument mit dieser ID gefunden');
        return null;
      }
    } catch (error) {
      console.error('Fehler beim Abrufen des Dokuments:', error);
      return null;
    }
  }


  // --------------------------Update Db with avatar?--------------------------------------

  async updateUser(id : string, avatarRef : string) {
    const userRef = doc(this.db, "Users", id);
    await updateDoc(userRef, {
      avatar: avatarRef
    });
    console.log(id, avatarRef)
  }
}
