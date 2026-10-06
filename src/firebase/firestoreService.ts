import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "./config.ts";
import { handleFirestoreError, OperationType } from "./errorHandler.ts";

export interface PrayerRequestPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  isPrivate?: boolean;
}

export interface ContactMessagePayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface EventRSVPPayload {
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  attendees: string;
}

// 1. Submit Prayer Request
export async function submitPrayerRequest(payload: PrayerRequestPayload): Promise<string> {
  const collectionPath = "prayerRequests";
  const id = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const currentUser = auth.currentUser;

  const data = {
    id,
    name: payload.name.trim(),
    email: payload.email.trim(),
    phone: payload.phone ? payload.phone.trim() : "",
    subject: payload.subject ? payload.subject.trim() : "Prayer Petition",
    message: payload.message.trim(),
    isPrivate: payload.isPrivate ?? true,
    status: "pending",
    userId: currentUser ? currentUser.uid : null,
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, collectionPath, id), data);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${collectionPath}/${id}`);
  }
}

// 2. Submit Contact Message
export async function submitContactMessage(payload: ContactMessagePayload): Promise<string> {
  const collectionPath = "contactMessages";
  const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const currentUser = auth.currentUser;

  const data = {
    id,
    name: payload.name.trim(),
    email: payload.email.trim(),
    phone: payload.phone ? payload.phone.trim() : "",
    subject: payload.subject ? payload.subject.trim() : "General Enquiry",
    message: payload.message.trim(),
    status: "unread",
    userId: currentUser ? currentUser.uid : null,
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, collectionPath, id), data);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${collectionPath}/${id}`);
  }
}

// 3. Submit Event RSVP
export async function submitEventRSVP(payload: EventRSVPPayload): Promise<string> {
  const collectionPath = "eventRsvps";
  const id = `rsvp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const currentUser = auth.currentUser;

  const data = {
    id,
    eventId: payload.eventId,
    eventTitle: payload.eventTitle,
    name: payload.name.trim(),
    email: payload.email.trim(),
    attendees: payload.attendees,
    userId: currentUser ? currentUser.uid : null,
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, collectionPath, id), data);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${collectionPath}/${id}`);
  }
}

// 4. Subscribe to user's prayer requests
export function subscribeUserPrayerRequests(
  userId: string,
  onData: (data: any[]) => void,
  onError?: (err: any) => void
) {
  const collectionPath = "prayerRequests";
  const q = query(
    collection(db, collectionPath),
    where("userId", "==", userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((d) => d.data());
      onData(list);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, collectionPath);
    }
  );
}

// 5. Subscribe to user's RSVPs
export function subscribeUserRSVPs(
  userId: string,
  onData: (data: any[]) => void,
  onError?: (err: any) => void
) {
  const collectionPath = "eventRsvps";
  const q = query(
    collection(db, collectionPath),
    where("userId", "==", userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((d) => d.data());
      onData(list);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, collectionPath);
    }
  );
}
