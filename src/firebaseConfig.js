
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVguFICrmIcpFHHIzyp36LCNmfubnllas",
  authDomain: "teamon-3dc3d.firebaseapp.com",
  projectId: "teamon-3dc3d",
  storageBucket: "teamon-3dc3d.firebasestorage.app",
  messagingSenderId: "1036552973826",
  appId: "1:1036552973826:web:f095b56deb2fbe1c68811b",
  measurementId: "G-7C4M03TG0V"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);


export default app;