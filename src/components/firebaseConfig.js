// firebaseConfig.js
import { initializeApp } from '@firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCBTPs3j4R8GVtEGax6cLRl52S4TOXqy1Y",
    authDomain: "attendance-tracker-a0d08.firebaseapp.com",
    projectId: "attendance-tracker-a0d08",
    storageBucket: "attendance-tracker-a0d08.appspot.com",
    messagingSenderId: "666724407848",
    appId: "1:666724407848:web:bcbcc6f9a34edbcd1b331d",
    measurementId: "G-VG9CY2P382"
  };

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);

export { app, auth, db };
