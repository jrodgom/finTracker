import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDliRiy-wLsaVGiUE10wHe8b3F8iqeqodo",
  authDomain: "fintracker-34bff.firebaseapp.com",
  projectId: "fintracker-34bff",
  storageBucket: "fintracker-34bff.firebasestorage.app",
  messagingSenderId: "782444429624",
  appId: "1:782444429624:web:b801f11cccade6fbc281cd"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {
  auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  GoogleAuthProvider
};
