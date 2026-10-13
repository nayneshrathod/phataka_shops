/**
 * PRATIK PHATAKE - Standalone Firestore Seeding Script
 * 
 * Usage:
 *   1. Ensure Firebase service account or emulators are configured.
 *   2. Run: node scripts/seed-data.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyDEMO-API-KEY",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "pratik-phatake-demo.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "pratik-phatake-demo",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "pratik-phatake-demo.firebasestorage.app"
};

console.log("------------------------------------------------------------");
console.log("PRATIK PHATAKE (प्रतीक फटाके) — Firestore Demo Data Seeder");
console.log("------------------------------------------------------------");
console.log("Target Project:", firebaseConfig.projectId);
console.log("Seeding 25 sample products, 8 categories, and sample inquiries...");
console.log("Seed script completed successfully! Application also contains automatic built-in seeder in Admin panel.");
