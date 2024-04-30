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
  chatDatas: any[] = [];
  ownMessage = false;


  constructor() { }

  async sendChat(currentUserId: any, chatPartnerId: any, timeStamp: any, message: any) {
    await this.createDirectMessageCollection(currentUserId, chatPartnerId, timeStamp);
    await this.saveMessageAtCurrentUserDB(currentUserId, chatPartnerId, timeStamp, message)
    await this.saveMessateAtChatPartnerDB(currentUserId, chatPartnerId, timeStamp, message)
}


  async createDirectMessageCollection(currentUserId: any, chatPartnerId: any, timeStamp: any) {
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


  async saveMessageAtCurrentUserDB(currentUserId: any, chatPartnerId: any, timeStamp: any, message: any) {
    const userDocRef = doc(this.db, 'Direct-Message', currentUserId);
    const chatPartnerSubcollectionRef = collection(userDocRef, chatPartnerId);
    const chatDocRef = doc(chatPartnerSubcollectionRef, timeStamp.toString())
    await this.setMessageDocument(currentUserId, chatDocRef, message, timeStamp);
  }


  async saveMessateAtChatPartnerDB(currentUserId: any, chatPartnerId: any, timeStamp: any, message: any) {
    const userDocRef = doc(this.db, 'Direct-Message', chatPartnerId);
    const chatPartnerSubcollectionRef = collection(userDocRef, currentUserId);
    const chatDocRef = doc(chatPartnerSubcollectionRef, timeStamp.toString())
    await this.setMessageDocument(currentUserId, chatDocRef, message, timeStamp);
  }


  async setMessageDocument(currentUserId: any, chatDocRef: any, message: any, timeStamp: any) {
    let userData = await this.firestoreService.getUserDataById(currentUserId);
    if (userData) {
      let userName = userData['name'];

      await setDoc(chatDocRef, {
        message: message,
        user: {
          id: currentUserId,
          name: userName
        },
        time: timeStamp,
        emoji: {},
      });
    }
  }



  /**
   * This function download the datas from the subcollection with liveUpdate for the chat
   */
  async getCurrentChats(currentUserId: string, chatPartnerId: any): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const q = query(collection(this.db, "Direct-Message", currentUserId, chatPartnerId));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const chat: any[] = [];
        this.chatDatas = chat;
        this.setCurrentChatDatas(querySnapshot, chat, currentUserId)

        resolve(chat);
      }, (error) => {
        console.error('Fehler beim Laden der Daten:', error);
        reject(error);
      });
    });
  }


  /**
   * This function set the from snapshot to the variables
   */
  setCurrentChatDatas(querySnapshot: any, chat: any, currentUserId: any) {
    querySnapshot.forEach((doc: any) => {
      const message = doc.data();
      chat.push(message);
      this.chatDatas = chat;
      this.controllIfOwnMessageSend(message, currentUserId)
      console.log(this.chatDatas);

    });
  }


  /**
   * This feature controls whether the message displayed in the chat is sent by the logged in user or by another user. (to present your own messages in the correct style)
   */
  controllIfOwnMessageSend(message: any, currentUserId: any) {
    if (message.user && message.user.id) {
      const userId = message.user.id;
      if (currentUserId !== userId) {
        this.ownMessage = false;
        message.ownMessage = false;
      } else if (currentUserId === userId) {
        this.ownMessage = true
        message.ownMessage = true
      }
    }
  }


  async editMessage(currentUserId: any, chatPartnerId: any, message: any, messageId: any) {
    const docRef = doc(this.db, "Direct-Message", currentUserId, chatPartnerId, messageId);
    await updateDoc(docRef, {
      message: message,
    });
  }


  async getMessageForEdit(currentUserId: any, currentChatPartnerId: any, messageId: any) {
    const docRef = doc(this.db, "Direct-Message", currentUserId, currentChatPartnerId, messageId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let message = docSnap.data()['message']
      return message

    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  }

}
