import { Injectable, inject, } from '@angular/core';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { FirestoreService } from './firestore.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  firestoreService = inject(FirestoreService)
  storage = getStorage();
  storageRef = ref(this.storage);
  imagesRef: any;
  pic: File | any;
  downloadedProfileImg: any;
  userId: any;


  // Create a reference from a Google Cloud Storage URI

  constructor(private http: HttpClient, private route: ActivatedRoute) { }


  /**
   * This function is currently not in Use !!! PLEASE DONT USE (erstmal nicht zu nutzen, vllt später um im chat bilder hoch zu laden)
   */
  async onFileSelected(event: any) {  //Diese function kommt auf das input type=file
    this.pic = event.target.files[0];
    if (this.pic) {
      // Wenn eine Datei ausgewählt wurde, erstellen Sie die Referenz zum Bild im Cloud-Speicher
      this.imagesRef = ref(this.storage, 'images/' + this.pic.name);
    }
  }


  /**
   * This function upload the picture to our Storage
   */
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


  /**
   * This function sets the picture to our firestore Storage with the name 'ownPictureDA' for the Profile Piture
   */
  async avatarSelected(event: any, userId: any) {  //Diese function kommt auf das input type=file
    this.pic = event.target.files[0];
    if (this.pic) {
      // Wenn eine Datei ausgewählt wurde, erstellen Sie die Referenz zum Bild im Cloud-Speicher
      this.imagesRef = ref(this.storage, userId + '/' + 'ownPictureDA');
      console.log(this.storage, 'name:', this.pic.name)
    }
  }


  /**
   * This function download the profilepicture and set the picture to the variable 'downloadedProifleImg' which is used e.g in head-dashboard.component
   * @param userId 
   */
  async downloadAvatar(userId: any) {
    const imgReference = ref(this.storage, `gs://dabubble-51e17.appspot.com/${userId}/ownPictureDA`);
    try {
      const url = await getDownloadURL(imgReference);
      // Bild herunterladen
      this.http.get(url, { responseType: 'blob' }).subscribe((blob: Blob) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.downloadedProfileImg = event.target?.result as string;
        };
        reader.readAsDataURL(blob);
      });
      // await this.firestoreService.getAllUsers()
    } catch (error) {
      console.error('Fehler beim Herunterladen des Bildes:', error);
    }
  }


  async downloadImage(imagePath: string): Promise<string> {
    const imgReference = ref(this.storage, imagePath);
    try {
      const imageUrl = await getDownloadURL(imgReference);
      return imageUrl;
    } catch (error) {
      throw new Error('Error downloading image from storage: ' + error);
    }
  }


  async uploadToChannelRef(file: any, channelId: any) {
    const fileName = file[0].name;
    const storageRef = ref(this.storage, `channels/${channelId}/${fileName}`);
    let imgUrl = null; // Standardmäßig auf null setzen

    const uploadImage = async () => {
      try {
        const blob = await this.getFileBlob(file[0]);
        const snapshot = await uploadBytes(storageRef, blob);
        imgUrl = await this.downloadImgChannelUrl(channelId, file[0].name); // Wenn das Bild erfolgreich hochgeladen wird, imgUrl aktualisieren
  
        console.log('Uploaded a blob or file!', imgUrl);
      } catch (error) {
        console.error('Error uploading file:', error);
        throw error; // Ausnahme auslösen, um sicherzustellen, dass ein Wert zurückgegeben wird
      }
    }
  
    await uploadImage();
    return imgUrl; //
  }


  async getFileBlob(file: any) {
    return new Promise<Blob>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          const blob = new Blob([reader.result], { type: file.type });
          resolve(blob);
        } else {
          reject(new Error('Fehler beim Lesen der Datei'));
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsArrayBuffer(file);
    });
  }


  async downloadImgChannelUrl(channelId: any, imgName: any) {
    const imgReference = ref(this.storage, `gs://dabubble-51e17.appspot.com/channels/${channelId}/${imgName}`);
    try {
      const url = await getDownloadURL(imgReference);
      return url; // Hier geben wir die URL zurück
    } catch (error) {
      console.error('Fehler beim Herunterladen des Bildes:', error);
      return null;
    }
  }


  async downloadImgPrivateChatUrl(userId: any, imgName: any) {
    const imgReference = ref(this.storage, `gs://dabubble-51e17.appspot.com/privateChats/${userId}/${imgName}`);
    try {
      const url = await getDownloadURL(imgReference);
      return url; // Hier geben wir die URL zurück
    } catch (error) {
      console.error('Fehler beim Herunterladen des Bildes:', error);
      return null;
    }
  }


  async uploadToPrivateRef(file: any, userId: any, chatPartnerId: any) {
    const fileName = file[0].name;
    const userStorageRef = ref(this.storage, `privateChats/${userId}/${fileName}`);
    const chatPartnerStorageRef = ref(this.storage, `privateChats/${chatPartnerId}/${fileName}`);
    let imgUrl = null; // Standardmäßig auf null setzen
  
    const uploadImage = async (storageRef: any) => {
      try {
        const blob = await this.getFileBlob(file[0]);
        const snapshot = await uploadBytes(storageRef, blob);
        imgUrl = await this.downloadImgPrivateChatUrl(userId, file[0].name); // Wenn das Bild erfolgreich hochgeladen wird, imgUrl aktualisieren
  
        console.log('Uploaded a blob or file!', imgUrl);
      } catch (error) {
        console.error('Error uploading file:', error);
        throw error; // Ausnahme auslösen, um sicherzustellen, dass ein Wert zurückgegeben wird
      }
    }
  
    await uploadImage(userStorageRef); // Für den Benutzer hochladen
    await uploadImage(chatPartnerStorageRef); // Für den Chat-Partner hochladen
    return imgUrl; // Rückgabe von imgUrl, unabhängig davon, ob das Bild hochgeladen wurde oder nicht
  }

}


