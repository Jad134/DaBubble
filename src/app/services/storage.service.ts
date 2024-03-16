import { Injectable, inject } from '@angular/core';
import { getStorage, ref } from "firebase/storage";
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  firestoreService = inject(FirestoreService)
  constructor() { }
}
