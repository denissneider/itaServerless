import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// 🔧 Konfiguracija z dodanim storageBucket
const firebaseConfig = {
  apiKey: "fake-api-key",
  authDomain: "localhost",
  projectId: "itafaas",
  storageBucket: "itafaas.appspot.com"
};

const app = initializeApp(firebaseConfig);

// Auth z emulatorjem
export const auth = getAuth(app);
connectAuthEmulator(auth, "http://localhost:9099");

// Functions z emulatorjem
export const functions = getFunctions(app);
connectFunctionsEmulator(functions, "localhost", 5001);

// Firestore z emulatorjem
export const db = getFirestore(app);
connectFirestoreEmulator(db, "localhost", 8080);

// Storage z emulatorjem
export const storage = getStorage(app);
connectStorageEmulator(storage, "localhost", 9199);
