// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqIpVq29_1haDUoT3ZiVB0V7wRR-JF1MY",
  authDomain: "pantry-app-6ba58.firebaseapp.com",
  projectId: "pantry-app-6ba58",
  storageBucket: "pantry-app-6ba58.appspot.com",
  messagingSenderId: "533403078085",
  appId: "1:533403078085:web:d4c9cca08814f4798b4fac",
  measurementId: "G-9MY012EH1Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };