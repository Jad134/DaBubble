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

  async sendChat(currentUserId: any, chatPartnerId: any, timeStamp: any) {
  await this.createDirectMessageCollection(currentUserId, chatPartnerId, timeStamp);
  
}


async createDirectMessageCollection(currentUserId: any, chatPartnerId: any, timeStamp: any){
  const userDocRef = doc(this.db, 'Direct-Message', currentUserId);
  const chatPartnerSubcollectionRef = collection(userDocRef, chatPartnerId);
  const chatDocRef = doc(chatPartnerSubcollectionRef, timeStamp.toString())
  try {
      // Überprüfen, ob die Subkollektion für den Chat-Partner bereits existiert
      const collectionRef = await getDocs(chatPartnerSubcollectionRef);
      if (!collectionRef.empty) {
          console.log("Subkollektion existiert bereits.");
      } else {
          // Subkollektion für den Chat-Partner erstellen
          await setDoc(chatDocRef, {});
          console.log("Subkollektion wurde hinzugefügt.");
      }
  } catch (error) {
      console.error("Fehler beim Überprüfen der Subkollektion:", error);
  }
}


}
