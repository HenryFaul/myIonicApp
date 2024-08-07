import { initializeApp } from 'firebase/app';
import { getMessaging, Messaging } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyD0jHFkg5cSmjo8Kx9OWagf02Ot0kFVlpM",
    authDomain: "fibertime-136fc.firebaseapp.com",
    projectId: "fibertime-136fc",
    storageBucket: "fibertime-136fc.appspot.com",
    messagingSenderId: "208428028525",
    appId: "1:208428028525:web:57fac6717da540be1a2564"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Messaging and export it
export const messaging: Messaging = getMessaging(app);