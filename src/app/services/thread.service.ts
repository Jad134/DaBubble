import { Injectable, inject } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
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
  //  await this.createThreadSubCollection()
  }


  /**
   * This function creates the subcollection 'thread' for each sended message. 
   * The variables comes from channelsData Client where the message was sendet and the informations created.
   */
  async createThreadSubCollection(channelId:any, chatId:any, message:string, userId:any, userName:any) {
    const parentDocRef = doc(this.db, 'Channels', channelId, 'chat', chatId);
    const threadCollectionRef = collection(parentDocRef, 'thread');
    try {
      // Verwende die chatId als Dokumenten-ID und füge ein leeres Dokument zur Subcollection hinzu
      await setDoc(doc(threadCollectionRef, chatId), {
        message: message,
        time: chatId,
        emoji: {},
        user: {
          id: userId,
          name: userName
        },
      });
      console.log('Dokument in Subcollection "thread" wurde erfolgreich erstellt');
  } catch (error) {
      console.error('Fehler beim Erstellen des Dokuments in Subcollection "thread":', error);
  }
}
}
