import { Injectable, inject } from '@angular/core';
import { getStorage, ref, uploadBytes  } from "firebase/storage";
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  firestoreService = inject(FirestoreService)
  storage = getStorage();
  storageRef = ref(this.storage);
  imagesRef:  any;
  pic: File | any;
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

  async avatarSelected(event: any, userId:any) {  //Diese function kommt auf das input type=file
    this.pic = event.target.files[0];
    if (this.pic) {
      // Wenn eine Datei ausgewählt wurde, erstellen Sie die Referenz zum Bild im Cloud-Speicher
      this.imagesRef = ref(this.storage, userId + '/' + this.pic.name);
      console.log(this.storage,'name:', this.pic.name)
    }
  }

}
