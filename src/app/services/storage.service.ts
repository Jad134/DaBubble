import { Injectable, inject } from '@angular/core';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  firestoreService = inject(FirestoreService)
  storage = getStorage();
  storageRef = ref(this.storage);
  imagesRef: any;
  pic: File | any;

  // Create a reference from a Google Cloud Storage URI
  
  constructor() { }

  async onFileSelected(event: any) {  //Diese function kommt auf das input type=file
    this.pic = event.target.files[0];
    if (this.pic) {
      // Wenn eine Datei ausgewählt wurde, erstellen Sie die Referenz zum Bild im Cloud-Speicher
      this.imagesRef = ref(this.storage, 'images/' + this.pic.name);
    }
  }

  async uploadImg() { // Diese function kommt auf den upload button
    if (this.pic) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (e.target && e.target.result) {
          const blob = new Blob([e.target.result], { type: this.pic.type });
          uploadBytes(this.imagesRef, blob).then((snapshot) => {
            console.log('Uploaded a blob or file!');
          });
        }
      };
      fileReader.readAsArrayBuffer(this.pic);
    } else {
      console.error('No image selected');
    }
  }

  async avatarSelected(event: any, userId: any) {  //Diese function kommt auf das input type=file
    this.pic = event.target.files[0];
    if (this.pic) {
      // Wenn eine Datei ausgewählt wurde, erstellen Sie die Referenz zum Bild im Cloud-Speicher
      this.imagesRef = ref(this.storage, userId + '/' + 'ownPictureDA');
      console.log(this.storage, 'name:', this.pic.name)
    }
  }

  async downloadAvatar(userId: any) {
    const imgReference = ref(this.storage, `gs://dabubble-51e17.appspot.com/${userId}/ownPictureDA`);
  
    try {
      const url = await getDownloadURL(imgReference);
  
      // Bild herunterladen
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
  
      xhr.onload = () => {
        const blob = xhr.response;
        // Hier können Sie mit dem Blob arbeiten, z.B. anzeigen oder speichern
      };
  
      xhr.open('GET', url);
      xhr.send();
    } catch (error) {
      console.error('Fehler beim Herunterladen des Bildes:', error);
    }
  }
}
