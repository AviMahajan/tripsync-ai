import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, onSnapshot, query, where, getDocs, updateDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const firebaseService = {
  db,
  createRoom: async (data: any) => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const docRef = await addDoc(collection(db, 'rooms'), { ...data, status: 'waiting', createdAt: new Date().toISOString(), code });
    return { id: docRef.id, code };
  },
  joinRoom: async (code: string, name: string) => {
    const q = query(collection(db, 'rooms'), where('code', '==', code));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) throw new Error('Invalid Room Code');
    const roomId = querySnapshot.docs[0].id;
    const docRef = await addDoc(collection(db, 'participants'), { roomId, name, ready: false, joinedAt: new Date().toISOString() });
    return { participantId: docRef.id, roomId };
  },
  getRoomByCode: async (code: string) => {
    const q = query(collection(db, 'rooms'), where('code', '==', code));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
  },
  updateParticipant: async (participantId: string, data: any) => {
    await updateDoc(doc(db, 'participants', participantId), data);
  },
  updateRoom: async (roomId: string, data: any) => {
    await updateDoc(doc(db, 'rooms', roomId), data);
  },
  getRoom: (id: string, callback: (room: any) => void) => {
    return onSnapshot(doc(db, 'rooms', id), (doc) => callback({ id: doc.id, ...doc.data() }));
  },
  getParticipants: (roomId: string, callback: (participants: any[]) => void) => {
    return onSnapshot(query(collection(db, 'participants'), where('roomId', '==', roomId)), (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  },
  getRoomOnce: async (id: string) => {
    const docRef = doc(db, 'rooms', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() };
  },
  getParticipantsOnce: async (roomId: string) => {
    const q = query(collection(db, 'participants'), where('roomId', '==', roomId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};
