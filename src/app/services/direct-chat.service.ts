import { Injectable, inject } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { Firestore, getFirestore } from '@angular/fire/firestore';
import { initializeApp } from '@angular/fire/app';
import { QuerySnapshot, addDoc, arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc } from 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class DirectChatService {


  firestoreService = inject(FirestoreService);
  firestore: Firestore = inject(Firestore);
  app = initializeApp(this.firestoreService.firebaseConfig);
  db = getFirestore(this.app);
  channelDB = collection(this.firestore, 'Channels');

  constructor() { }

  async sendChat(currentUserId:any, chatPartnerId:any){
    const docRef = doc(this.db, 'Direct-Message', currentUserId, 'chats', chatPartnerId);

    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
          console.log("Dokument existiert bereits.");
      } else {
        console.log("Dokument existiert nicht.");
      }
  } catch (error) {
      console.error("Fehler beim Überprüfen des Dokuments:", error);
  }
  }
}
