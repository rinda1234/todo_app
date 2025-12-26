import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAJzBLXcgjTvMeEWED9-WJUY6G4so_hnA0",
    authDomain: "fir-database-2de0e.firebaseapp.com",
    projectId: "fir-database-2de0e",
    storageBucket: "fir-database-2de0e.firebasestorage.app",
    messagingSenderId: "40516037416",
    appId: "1:40516037416:web:429cf8386d5a2f38a77e1d",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
