import { Injectable, Component, inject } from '@angular/core';
import { Firestore, } from '@angular/fire/firestore';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth'

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


  constructor() { }

  
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

}
