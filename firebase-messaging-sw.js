// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8zpeXuvi8bGuQQW_k4j2jn4HMm5GnA40",
  authDomain: "jovial-branch-295110.firebaseapp.com",
  projectId: "jovial-branch-295110",
  storageBucket: "jovial-branch-295110.appspot.com",
  messagingSenderId: "92463015553",
  appId: "1:92463015553:web:df410aa2866ccb8fb20f80",
  measurementId: "G-FYXFL41GE8"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

// messaging.onMessage((payload) => {
//   console.log('Message received. ', payload);
//   // ...
// });

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});