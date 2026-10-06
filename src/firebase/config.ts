import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import defaultAppletConfig from "../../firebase-applet-config.json";

// Updated Firebase configuration from user console
export const firebaseConfig = {
  apiKey: "AIzaSyARG3ehu2n1B9NBQ7z-3RkMBIa7UOg2b-o",
  authDomain: "orbital-talent-vvr20.firebaseapp.com",
  projectId: "orbital-talent-vvr20",
  storageBucket: "orbital-talent-vvr20.firebasestorage.app",
  messagingSenderId: "413770725133",
  appId: "1:413770725133:web:01b9b19dc678c64476a244",
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || defaultAppletConfig.firestoreDatabaseId || "ai-studio-thegreatmissionc-b0a51e3f-cce4-4e2e-82a7-5d9b232e1cc3",
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore (with specific database ID when configured)
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)"
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

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
