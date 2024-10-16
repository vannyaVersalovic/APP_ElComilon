import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private storage: AngularFireStorage) {}

  uploadFile(filePath: string, file: File) {
    return this.storage.upload(filePath, file);
  }

  getFileUrl(filePath: string) {
    return this.storage.ref(filePath).getDownloadURL();
  }
}
