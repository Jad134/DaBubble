import { Injectable, inject, NgZone } from '@angular/core';
import { Firestore, getFirestore } from '@angular/fire/firestore';
import { initializeApp } from '@angular/fire/app';
import { getAuth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from '../../models/user.class';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { FirestoreService } from './firestore.service';
import { channel } from '../../models/channels.class';
import { Channel } from 'diagnostics_channel';

@Injectable({
  providedIn: 'root',
})
export class channelDataclientService {
  constructor() {}

  firestoreService = inject(FirestoreService);
  firestore: Firestore = inject(Firestore);
  app = initializeApp(this.firestoreService.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore(this.app);

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
        name: channel.name,
        description: channel.description,
        usersInChannel: simplifiedUsersInChannel,
      });
      console.log('Dokument written with ID: ', docRef.id);
    } catch (error) {
      console.log('Error writing document: ', error);
    }
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
}
