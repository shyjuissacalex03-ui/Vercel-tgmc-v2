import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./config.ts";

// Configured admin email from runtime instructions
export const ADMIN_EMAIL = "shyjuissacalex03@gmail.com";

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, displayName: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAdmin: false,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  sendPasswordReset: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        const userEmail = (user.email || "").toLowerCase().trim();
        const isMasterAdmin = userEmail === ADMIN_EMAIL.toLowerCase();

        // Also check if admin doc exists
        let hasAdminDoc = false;
        try {
          const adminDoc = await getDoc(doc(db, "admins", user.uid));
          if (adminDoc.exists()) {
            hasAdminDoc = true;
          }
        } catch {
          // ignore error for non-admins
        }

        const adminStatus = isMasterAdmin || hasAdminDoc;
        setIsAdmin(adminStatus);

        // Sync user profile to Firestore
        try {
          await setDoc(
            doc(db, "users", user.uid),
            {
              userId: user.uid,
              displayName: user.displayName || user.email?.split("@")[0] || "TGMC Member",
              email: user.email || "",
              photoURL: user.photoURL || "",
              isAdmin: adminStatus,
              createdAt: new Date().toISOString(),
            },
            { merge: true }
          );

          if (isMasterAdmin) {
            // Ensure record in admins collection
            await setDoc(
              doc(db, "admins", user.uid),
              {
                uid: user.uid,
                email: user.email,
                role: "Super Admin",
                grantedAt: new Date().toISOString(),
              },
              { merge: true }
            );
          }
        } catch (err) {
          console.warn("Could not sync user profile:", err);
        }
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
    } catch (error) {
      console.error("Email Sign-In Error:", error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, displayName: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (displayName) {
        await updateProfile(cred.user, { displayName });
      }
    } catch (error) {
      console.error("Email Sign-Up Error:", error);
      throw error;
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (error) {
      console.error("Password Reset Error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Sign-Out Error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        sendPasswordReset,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
