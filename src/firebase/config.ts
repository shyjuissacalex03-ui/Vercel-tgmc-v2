import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import defaultAppletConfig from "../../firebase-applet-config.json";

// Resolve Firebase configuration from Vercel environment variables (VITE_FIREBASE_*)
// with fallback to firebase-applet-config.json
export const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || defaultAppletConfig.projectId || "orbital-talent-vvr20",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || defaultAppletConfig.appId || "",
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || defaultAppletConfig.apiKey || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || defaultAppletConfig.authDomain || "orbital-talent-vvr20.firebaseapp.com",
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || defaultAppletConfig.firestoreDatabaseId || "ai-studio-thegreatmissionc-b0a51e3f-cce4-4e2e-82a7-5d9b232e1cc3",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || defaultAppletConfig.storageBucket || "orbital-talent-vvr20.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultAppletConfig.messagingSenderId || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || defaultAppletConfig.measurementId || "",
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID as required
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Test Firestore connection on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Firestore test connection: client is offline or network unreachable.");
    }
  }
}

testConnection();

export default { app, db, auth, storage };
