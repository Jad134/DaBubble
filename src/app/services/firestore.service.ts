import { Injectable, inject, NgZone } from '@angular/core';
import { Firestore, getDoc, getFirestore, onSnapshot } from '@angular/fire/firestore';
import {  initializeApp } from '@angular/fire/app';
import { getAuth, sendPasswordResetEmail } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from '../../models/user.class';
import { doc, updateDoc } from "firebase/firestore";


@Injectable({
  providedIn: 'root',
})
export class FirestoreService {

  firebaseConfig = {
    apiKey: 'AIzaSyDiGmIlzMq2kQir6-xnHFX9iOXxH1Wcj8o',
    authDomain: 'dabubble-51e17.firebaseapp.com',
    databaseURL:
      'https://dabubble-51e17-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'dabubble-51e17',
    storageBucket: 'dabubble-51e17.appspot.com',
    messagingSenderId: '185514198211',
    appId: '1:185514198211:web:53ebf5cdc18b5567090e76',
    measurementId: 'G-4HJ8MGXTCJ',
  };

  firestore: Firestore = inject(Firestore);
  app = initializeApp(this.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore(this.app);
  users = new User();


  constructor(private router: Router, public ngZone: NgZone) { }

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
