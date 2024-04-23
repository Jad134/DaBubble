import { Injectable, inject } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { addDoc, collection, doc } from 'firebase/firestore';
import { Firestore, getFirestore } from '@angular/fire/firestore';
import { initializeApp } from '@angular/fire/app';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class ThreadService {
  firestoreService = inject(FirestoreService);
  firestore: Firestore = inject(Firestore);
  app = initializeApp(this.firestoreService.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore(this.app);
  channelDB = collection(this.firestore, 'Channels');

  currentChatId: any;
  currentGroupId: any;


  constructor() { }


  async getCurrentThread() {
   await this.createThreadSubCollection()
  }


  async createThreadSubCollection() {
    const parentDocRef = doc(this.db, 'Channels', this.currentGroupId, 'chat', this.currentChatId);

    const threadCollectionRef = collection(parentDocRef, 'thread');
    try {
      // Ein leeres Dokument zur Subcollection hinzufügen, um sie zu erstellen
      const threadDocRef = await addDoc(threadCollectionRef, {});
      console.log('Subcollection "thread" wurde erfolgreich erstellt');
    } catch (error) {
      console.error('Fehler beim Erstellen der Subcollection "thread":', error);
    }
  }
}
