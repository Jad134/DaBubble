import { Injectable, inject } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { addDoc, collection, doc, onSnapshot, query, setDoc } from 'firebase/firestore';
import { Firestore, getFirestore } from '@angular/fire/firestore';
import { initializeApp } from '@angular/fire/app';
import { getAuth } from 'firebase/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ThreadService {
  firestoreService = inject(FirestoreService);
  firestore: Firestore = inject(Firestore);
  downloadService = inject(StorageService);
  app = initializeApp(this.firestoreService.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore(this.app);
  channelDB = collection(this.firestore, 'Channels');
  currentChatId: any;
  currentGroupId: any;
  chatDatas: any[] = [];
  ownMessage = false;

  private currentChannelDataSubject = new BehaviorSubject<any>(null);
  currentChannelData$ = this.currentChannelDataSubject.asObservable();


  constructor() { }


  async getCurrentThread() {
    //  await this.createThreadSubCollection()
  }




  /**
   * This function creates the subcollection 'thread' for each sended message. 
   * The variables comes from channelsData Client where the message was sendet and the informations created.
   */
  async createThreadSubCollection(channelId: any, messageId: any, message: string, userId: any, userName: any) {
    const parentDocRef = doc(this.db, 'Channels', channelId, 'chat', messageId);
    const threadCollectionRef = collection(parentDocRef, 'thread');
    try {
      // Verwende die chatId als Dokumenten-ID und füge ein leeres Dokument zur Subcollection hinzu
      await setDoc(doc(threadCollectionRef, messageId), {
        message: message,
        time: messageId,
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


  /**
   * This function returns the chat, when open the thread
   */
  getCurrentThreadCollection(channelId: any, messageId: any, currentUserId: any) {
    return new Promise((resolve, reject) => {
      const q = query(collection(this.db, "Channels", channelId, 'chat', messageId, 'thread'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const chat: any[] = [];
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


  /**
   * This function saved the message in the thread subcollection
   */
  async sendMessageToThread(timeStamp: string, message: string, userId: string,) {
    const chatRef = doc(this.db, "Channels", this.currentGroupId, 'chat', this.currentChatId, 'thread', timeStamp);
    let userData = await this.firestoreService.getUserDataById(userId);
    if (userData) {
      let userName = userData['name'];
      await this.loadProfilePictures(userData); // Benutzeravatar aktualisieren
      let avatar = userData['avatar'];
      try {
        this.setMessageDocument(chatRef, message, userId, userName, timeStamp, avatar)
        console.log("Chat-Dokument erfolgreich erstellt.");
      } catch (error) {
        console.error("Fehler beim Erstellen des Chat-Dokuments:", error);
      }
    } else {
      console.log('Benutzerdaten nicht gefunden');
    }
  }


  /**
   * This function download the avatar link if an user use a own avatar and sets the avatar to the user object 
   */
  async loadProfilePictures(user: any) {
    if (user.avatar === 'ownPictureDA') {
      const profilePictureURL = `gs://dabubble-51e17.appspot.com/${user.id}/ownPictureDA`;
      try {
        const downloadedImageUrl = await this.downloadService.downloadImage(profilePictureURL);
        // Weisen Sie die heruntergeladenen Bild-URL direkt dem Benutzerobjekt zu
        user.avatar = downloadedImageUrl;
      } catch (error) {
        console.error('Error downloading user profile picture:', error);
      }
    }
  }


  /**
   * Sets a new message document in the specified chat reference.
   */
  async setMessageDocument(chatRef: any, message: string, userId: string, userName: string, timeStamp: string, avatar: any) {
    await setDoc(chatRef, {
      message: message,
      user: {
        id: userId,
        name: userName,
        avatar: avatar
      },
      time: timeStamp,
      emoji: {},
    });
  }


  setCurrentChannelData(currentChannelData: any) {
    this.currentChannelDataSubject.next(currentChannelData);
  }
}
