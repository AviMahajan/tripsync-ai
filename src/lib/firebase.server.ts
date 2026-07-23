import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, onSnapshot, query, where, getDocs, updateDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const firebaseService = {
  db,
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
