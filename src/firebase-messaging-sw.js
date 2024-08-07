import firebase from "firebase/app";

importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyD0jHFkg5cSmjo8Kx9OWagf02Ot0kFVlpM",
    authDomain: "fibertime-136fc.firebaseapp.com",
    projectId: "fibertime-136fc",
    storageBucket: "fibertime-136fc.appspot.com",
    messagingSenderId: "208428028525",
    appId: "1:208428028525:web:57fac6717da540be1a2564"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});