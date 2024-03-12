import { Injectable, Component, inject,NgZone } from '@angular/core';
import { Firestore, } from '@angular/fire/firestore';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential, signInWithPopup, signInWithRedirect } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Auth, GoogleAuthProvider } from '@angular/fire/auth'
import { Router } from '@angular/router';
import { routes } from '../app.routes';
import { User } from '../../models/user.class';


@Injectable({
  providedIn: 'root'
})


export class FirestoreService {

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
  
  
  

  constructor(private router : Router, public ngZone: NgZone) { }

   //----------------------------------------Create Account------------------------------------------
   async createUserWithEmailAndPassword(email: string, password: string): Promise<void> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Erfolgreich registriert
        const user = userCredential.user;
        // Weitere Aktionen...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // Fehlerbehandlung...
      });
  }

  //-- ----------------------------------- ---Anmelden--------------------------------------------
  // https://www.linkedin.com/pulse/angular-14-firebase-authentication-tutorial-attia-imed/ daraus kommt die anmlede funktion
   
 
  async Login(email : string, password : string){
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      
      this.ngZone.run(() => {
        this.router.navigate(['/dashboard']);
      });
    } catch (error) {
      window.alert('error, anmelden geht nicht');
    }
  }

   //Login with Google
   GoogleAuth() {
    return this.loginWithPopup(new GoogleAuthProvider());
  }

  async loginWithPopup(provider :any) {
    return signInWithPopup(this.auth,provider).then(() => {
      this.router.navigate(['dashboard']);
    });
  }

}
