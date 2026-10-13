import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfile, UserRole } from '@core/models';
import { FirebaseService } from './firebase.service';
import { DemoDataService } from './demo-data.service';
import {
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private firebaseService = inject(FirebaseService);
  private demoData = inject(DemoDataService);
  private router = inject(Router);

  private readonly AUTH_STORAGE_KEY = 'pratik_auth_session';

  private readonly currentUserSignal = signal<UserProfile | null>(this.getStoredSession());
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoading = this.loadingSignal.asReadonly();
  readonly authError = this.errorSignal.asReadonly();

  readonly isAuthenticated = computed(() => !!this.currentUserSignal());
  readonly userRole = computed<UserRole>(() => this.currentUserSignal()?.role || 'customer');
  readonly isSuperAdmin = computed(() => this.isAuthenticated() && this.userRole() === 'super_admin');
  readonly isAdmin = computed(() => this.isAuthenticated() && (this.userRole() === 'admin' || this.userRole() === 'super_admin'));
  readonly isStaff = computed(() => this.isAuthenticated() && ['staff', 'admin', 'super_admin'].includes(this.userRole()));
  readonly isCustomer = computed(() => this.isAuthenticated() && this.userRole() === 'customer');

  constructor() {
    this.listenToAuthChanges();
  }

  private getStoredSession(): UserProfile | null {
    try {
      const data = localStorage.getItem(this.AUTH_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return null; // Visitors start as unauthenticated guests
  }

  private saveSession(user: UserProfile | null): void {
    this.currentUserSignal.set(user);
    try {
      if (user) {
        localStorage.setItem(this.AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(this.AUTH_STORAGE_KEY);
      }
    } catch {
      // ignore storage error
    }
  }

  private listenToAuthChanges(): void {
    const auth = this.firebaseService.auth;
    if (this.firebaseService.isLiveFirebase && auth) {
      onAuthStateChanged(auth, (user) => {
        if (!user) {
          if (!this.currentUserSignal()) {
            this.saveSession(null);
          }
        }
      });
    }
  }

  async login(email: string, pass: string): Promise<boolean> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      // Check demo credentials
      const demoUser = this.demoData.getDemoUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
      if (demoUser) {
        this.saveSession(demoUser);
        this.loadingSignal.set(false);
        return true;
      }

      // Try Live Firebase Auth if available
      const auth = this.firebaseService.auth;
      if (this.firebaseService.isLiveFirebase && auth) {
        const userCred = await signInWithEmailAndPassword(auth, email, pass);
        const profile: UserProfile = {
          uid: userCred.user.uid,
          email: userCred.user.email || email,
          displayName: userCred.user.displayName || 'Authorized Staff',
          role: 'admin',
          active: true,
          createdAt: new Date().toISOString()
        };
        this.saveSession(profile);
        this.loadingSignal.set(false);
        return true;
      }

      // Fallback: Default mock login for valid looking staff emails
      if (email.includes('@pratikphatake.com') || email === 'admin@phatake.com') {
        const profile: UserProfile = {
          uid: 'user-' + Date.now(),
          email,
          displayName: 'Admin Staff',
          role: 'admin',
          active: true,
          createdAt: new Date().toISOString()
        };
        this.saveSession(profile);
        this.loadingSignal.set(false);
        return true;
      }

      throw new Error('अमान्य ईमेल किंवा पासवर्ड (Invalid credentials).');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      this.errorSignal.set(msg);
      this.loadingSignal.set(false);
      return false;
    }
  }

  demoSwitchRole(role: UserRole): void {
    const found = this.demoData.getDemoUsers().find(u => u.role === role);
    if (found) {
      this.saveSession(found);
    }
  }

  async resetPassword(email: string): Promise<boolean> {
    this.loadingSignal.set(true);
    try {
      const auth = this.firebaseService.auth;
      if (this.firebaseService.isLiveFirebase && auth) {
        await sendPasswordResetEmail(auth, email);
      }
      this.loadingSignal.set(false);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Reset failed';
      this.errorSignal.set(msg);
      this.loadingSignal.set(false);
      return false;
    }
  }

  async logout(redirectTo = '/'): Promise<void> {
    const auth = this.firebaseService.auth;
    if (this.firebaseService.isLiveFirebase && auth) {
      await fbSignOut(auth);
    }
    this.saveSession(null);
    this.router.navigate([redirectTo]);
  }
}

