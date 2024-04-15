import { Injectable, inject, NgZone } from '@angular/core';
import { Firestore, getFirestore } from '@angular/fire/firestore';
import { initializeApp } from '@angular/fire/app';
import { getAuth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from '../../models/user.class';
import { addDoc, collection, doc, getDocs, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { FirestoreService } from './firestore.service';
import { channel } from '../../models/channels.class';
import { Channel } from 'diagnostics_channel';

@Injectable({
  providedIn: 'root',
})
export class channelDataclientService {
  constructor() { }

  firestoreService = inject(FirestoreService);
  firestore: Firestore = inject(Firestore);
  app = initializeApp(this.firestoreService.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore(this.app);
  channelDB = collection(this.firestore, 'Channels');
  channelIds = [];
  channels: channel[] = [];



  /**
   * this function stores a new Channel in firestore
   * @param channel 
   */
  async storeNewChannel(channel: any) {
    try {
      const simplifiedUsersInChannel = this.convertUsersInChannel(
        channel.usersInChannel
      );

      const docRef = await addDoc(collection(this.db, 'Channels'), {
        id: channel.id,
        name: channel.name,
        description: channel.description,
        creator: channel.creator,
        usersInChannel: simplifiedUsersInChannel,
      });
      let channelId = docRef.id
      this.updateChannelId(channelId)
      console.log('Dokument written with ID: ', docRef.id);
      for (const user of simplifiedUsersInChannel) {
        await this.firestoreService.updateUsersChannels(user.id, channelId);
      }

      await this.createChatCollection(channelId)

    } catch (error) {
      console.log('Error writing document: ', error);
    }
  }


  /**
  * This function create a subcollection which is called 'chat' for the chat function
  */
  async createChatCollection(collectionId: string) {
    const parentDocRef = doc(this.db, 'Channels', collectionId);
    await addDoc(collection(parentDocRef, 'chat'), {

    })
  }


  /**
   * This function sets the document with the timestamp as id. This doc has the information for the chats 
   */
  async sendChat(channelId:string, timeStamp:string, message:string, user:string,){
    const chatRef = doc(this.db, "Channels", channelId, 'chat', timeStamp);
     
    try {
      await setDoc(chatRef, {
          message: message,
          user: user,
          time: timeStamp,
          emoji:{},
      });
      console.log("Chat-Dokument erfolgreich erstellt.");
  } catch (error) {
      console.error("Fehler beim Erstellen des Chat-Dokuments:", error);
  }
  }


  async updateChannelId(channelId: any) {
    const channelRef = doc(this.db, "Channels", channelId);
    await updateDoc(channelRef, {
      id: channelId
    });
  }


  /**
   * Convert the usersInChannel object in a storeable object for Firestore
   * @param usersInChannel
   * @returns storeable object
   */
  convertUsersInChannel(usersInChannel: any[]): any[] {
    return usersInChannel.map((user) => ({
      name: user.name,
      eMail: user.eMail,
      avatar: user.avatar,
      id: user.id,
    }));
  }


  async getAllChannels() {
    const channelList: any[] = [];
    const querySnapshot = await getDocs(this.channelDB);
    querySnapshot.forEach((doc) => {
      const channelData = doc.data();
      const channel: any = {
        id: doc.id,
        name: channelData['name'],
        description: channelData['description'],
        usersInChannel: channelData['usersInChannel']
      };
      channelList.push(channel);
    });
    return channelList;
  }


  /**
  * This function returns the Ids for the Channels, which show at the sideNav
  * @param id 
  */
  async getUserChannelId(id: any) {
    const unsub = onSnapshot(doc(this.db, "Users", id), (doc) => {
      const UserData = doc.data();

      if (UserData) {
        console.log("Current data: ", UserData['channels']);
        const channels = UserData['channels']

        this.channelIds = channels
        console.log(this.channelIds);
        // this.getChannelNames()
        this.getChannels()
        return channels
      }

    });
  }


  /***
  * This function gets all chanels from the current user with the getUserChannelIds() ids.
  */
  async getChannels() {
    for (const channelId of this.channelIds) {
      // Überprüfen Sie, ob der Kanal bereits in this.channels vorhanden ist
      if (!this.channels.find(channel => channel.id === channelId)) {
        const unsub = onSnapshot(doc(this.db, "Channels", channelId), (channelDoc) => {
          if (channelDoc.exists()) {
            const channelData = channelDoc.data();
            const newChannel = new channel(channelData); // Neues channel-Objekt erstellen
            this.channels.push(newChannel); // Das neue channel-Objekt zum Array hinzufügen
            console.log(this.channels);
          } else {
            console.log("Kanal mit ID", channelId, "nicht gefunden.");
          }
        });
      }
    }
  }


  /**
   * This function waits for the channeldatas which is get by id and returns the datas. Used at the group-chat-component.
   */
  async getCurrentChannel(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const docRef = doc(this.firestore, 'Channels', id);

      const unsub = onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          resolve(data);
        } else {
          console.log('Der Kanal mit der ID', id, 'existiert nicht.');
          resolve(null);
        }
      });
    });
  }

  /**
   * Update the channel name in DB
   */
  async updateChannelName(id: string, name: string) {
    const channelRef = doc(this.db, "Channels", id);
    await updateDoc(channelRef, {
      name: name,
    });
  }

  /**
   * Update the channel description in DB
   */
  async updateChannelDescription(id: string, description: string) {
    const channelRef = doc(this.db, "Channels", id);
    await updateDoc(channelRef, {
      description: description,
    });
  }





}
