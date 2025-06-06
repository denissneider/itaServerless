import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// 🔧 Konfiguracija
const firebaseConfig = {
  apiKey: "fake-api-key",
  authDomain: "localhost",
  projectId: "itafaas",
};

const app = initializeApp(firebaseConfig);

// 🔐 Auth z emulatorjem
export const auth = getAuth(app);
connectAuthEmulator(auth, "http://localhost:9099");

// ⚙️ Functions z emulatorjem
export const functions = getFunctions(app);
connectFunctionsEmulator(functions, "localhost", 5001);

// 🔥 Firestore z emulatorjem
export const db = getFirestore(app);
connectFirestoreEmulator(db, "localhost", 8080);
