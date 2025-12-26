import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAJzBLXcgjTvMeEWED9-WJUY6G4so_hnA0",
    authDomain: "fir-database-2de0e.firebaseapp.com",
    projectId: "fir-database-2de0e",
    storageBucket: "fir-database-2de0e.firebasestorage.app",
    messagingSenderId: "40516037416",
    appId: "1:40516037416:web:429cf8386d5a2f38a77e1d",
    measurementId: "G-H1W8Y6X6E0"
};

// 🔥 중복 초기화 방지 (Expo에서 매우 중요)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
