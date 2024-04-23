import { Injectable, inject, NgZone } from '@angular/core';
import { Firestore, getDoc, getFirestore, onSnapshot } from '@angular/fire/firestore';
import { initializeApp } from '@angular/fire/app';
import { getAuth, sendPasswordResetEmail, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from '../../models/user.class';
import { doc, updateDoc, getDocs, collection, query, where, } from "firebase/firestore";
import { AllUser } from '../../models/allUser.class';
import { channel } from '../../models/channels.class';



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
  allUsers = new AllUser();

  user = this.auth.currentUser;
  userIds: any;

  channelNames: string[] = [];




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


  /**
   * This function download all UserDatas and is started after the storage.service function downloadAvatar() to pretend download mistakes 
   */
  async getAllUsers(): Promise<User[]> {
    const users: User[] = [];
    const querySnapshot = await getDocs(collection(this.db, 'Users'));
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      const user = new User(userData); // Erstellen Sie ein neues User-Objekt mit den abgerufenen Daten
      this.userIds = doc.id
      users.push(user); // Fügen Sie das User-Objekt zum Array hinzu
      console.log(user);
    });

    return users; // Geben Sie das Array der Benutzer zurück
  }


  async getAllUserIds(): Promise<string[]> {
    const userIds: string[] = [];
    const querySnapshot = await getDocs(collection(this.db, 'Users'));
    querySnapshot.forEach((doc) => {
      userIds.push(doc.id);
    });
    return userIds;
  }


  async getUser(id: string) {
    const unsub = onSnapshot(doc(this.firestore, 'Users', id), (element) => {
      return element.data();
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

  async updateUserAvatar(id: string, avatarRef: string) {
    const userRef = doc(this.db, "Users", id);
    await updateDoc(userRef, {
      avatar: avatarRef
    });
    console.log(id, avatarRef)
  }


  //---------------------------------------------------------------------- check Online function (vorerst)-------------------------
  async checkIfUserOnline(uid: string) {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log('Benutzer online:', user.uid);
        this.updateUserToOnline(uid)
      } else {
        console.log('Benutzer offline');
        this.updateUserToOffline(uid)
      }
    });
  }


  async updateUserToOnline(id: string,) {
    const userRef = doc(this.db, "Users", id);
    await updateDoc(userRef, {
      isOnline: true
    });
  }


  
  async updateUserToOffline(id: string,) {
    const userRef = doc(this.db, "Users", id);
    await updateDoc(userRef, {
      isOnline: false
    });
  }


  /**
   * Update the user data in DB
   * @param user User Object 
   */
  async updateUserNameAndMail(user: User) {
    const userRef = doc(this.db, "Users", user.id);
    await updateDoc(userRef, {
      name: user.name,
      email: user.eMail,
    });
  }


  /**
   * This function update the channels and import the channelid for every user which is added to an channel.
   */
  async updateUsersChannels(id: string, channelId: string) {
    try {
      const existingUserData = await this.getUserDataById(id);
      if (existingUserData) {
        let existingChannels: string[] = existingUserData['channels'] || []; 
        if (!Array.isArray(existingChannels)) {
          existingChannels = [existingChannels]; 
        }
        existingChannels.push(channelId);
        existingChannels = existingChannels.filter((id, index, self) => self.indexOf(id) === index);

        const userRef = doc(this.db, "Users", id);
        await updateDoc(userRef, {
          channels: existingChannels
        });
      } else {
        console.log('Keine Benutzerdaten mit dieser ID gefunden');
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Kanäle:', error);
    }
  }


  /**
   * This function update the channelsarray at the users db, when user leave a channel
   * */
  async updateUserChannelsIfDeleteOne(userId: string, channelId:any) {
    const userRef = doc(this.db, "Users", userId)
    await updateDoc(userRef, {
      channels: channelId
    });
  }

}
