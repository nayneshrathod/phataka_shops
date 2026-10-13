import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp, getApps } from 'firebase/app';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, FirebaseStorage, connectStorageEmulator } from 'firebase/storage';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app: FirebaseApp | null = null;
  private authInstance: Auth | null = null;
  private firestoreInstance: Firestore | null = null;
  private storageInstance: FirebaseStorage | null = null;
  private isConfigured = false;

  constructor() {
    this.initFirebase();
  }

  private initFirebase(): void {
    try {
      const isPlaceholder = !environment.firebase.apiKey || environment.firebase.apiKey.includes('DEMO');
      
      if (!isPlaceholder) {
        if (!getApps().length) {
          this.app = initializeApp(environment.firebase);
        } else {
          this.app = getApps()[0];
        }

        this.authInstance = getAuth(this.app);
        this.firestoreInstance = getFirestore(this.app);
        this.storageInstance = getStorage(this.app);
        this.isConfigured = true;

        if (environment.useEmulators) {
          connectAuthEmulator(this.authInstance, `http://localhost:${environment.emulatorPorts.auth}`);
          connectFirestoreEmulator(this.firestoreInstance, 'localhost', environment.emulatorPorts.firestore);
          connectStorageEmulator(this.storageInstance, 'localhost', environment.emulatorPorts.storage);
        }
      } else {
        // Safe demo/offline mode enabled
        this.isConfigured = false;
      }
    } catch (err) {
      console.warn('Firebase initialization notice: Running in simulated client-store mode.', err);
      this.isConfigured = false;
    }
  }

  get isLiveFirebase(): boolean {
    return this.isConfigured;
  }

  get auth(): Auth | null {
    return this.authInstance;
  }

  get firestore(): Firestore | null {
    return this.firestoreInstance;
  }

  get storage(): FirebaseStorage | null {
    return this.storageInstance;
  }
}
