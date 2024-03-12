import { Injectable, Component, inject, NgZone } from '@angular/core';
import { Firestore, getFirestore } from '@angular/fire/firestore';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential, signInWithPopup, signInWithRedirect, sendPasswordResetEmail } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Auth, GoogleAuthProvider } from '@angular/fire/auth'
import { Router } from '@angular/router';
import { routes } from '../app.routes';
import { User } from '../../models/user.class';
import { doc, setDoc } from "firebase/firestore";


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
  async createUserWithEmailAndPassword(email: string, password: string, userDatas: any): Promise < void> {
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
    // this.router.navigate(['/dashboard']);
  });
} catch (error) {
  console.error('Fehler beim Erstellen des Benutzers:', error);
}
  }


  //-- ----------------------------------- ---Anmelden--------------------------------------------
  // https://www.linkedin.com/pulse/angular-14-firebase-authentication-tutorial-attia-imed/ daraus kommt die anmlede funktion
   
 
  async Login(email : string, password : string){
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

//Login with Google
GoogleAuth() {
  return this.loginWithPopup(new GoogleAuthProvider());
}

  async loginWithPopup(provider : any) {
  return signInWithPopup(this.auth, provider).then(() => {
    this.router.navigate(['dashboard']);
  });
}

  //Send Password Reset Email
    async sendPasswordResetEmails(email : string){
      sendPasswordResetEmail(this.auth,email)
      .then(() => {
         window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
       window.alert(error.message);
     });
   }

}
