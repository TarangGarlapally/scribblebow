
importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js');

var firebaseConfig = {
    apiKey: "AIzaSyDxA7cvyf0YgPGc4MzzfKo_xy6QJuiBahc",
    authDomain: "scribblebow.firebaseapp.com",
    databaseURL: "https://scribblebow.firebaseio.com",
    projectId: "scribblebow",
    storageBucket: "scribblebow.appspot.com",
    messagingSenderId: "922017979428",
    appId: "1:922017979428:web:ddd59926e9587dffa50cb1",
    measurementId: "G-ZT8E0PS2Z2"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const messaging = firebase.messaging() ; 

  messaging.onMessage((payload)=>{
    console.log(payload  , "I am the Payload over the hey load" );
    const notification=JSON.parse(payload);
    const notificationOption={
        body:notification.body,
        icon:notification.icon
    };
    return self.registration.showNotification(payload.notification.title,notificationOption);
  }); 
  
    messaging.setBackgroundMessageHandler(function (payload) {
      console.log(payload  , "I am the Payload over the hey load" );
      const notification=JSON.parse(payload);
      const notificationOption={
          body:notification.body,
          icon:notification.icon
      };
      return self.registration.showNotification(payload.notification.title,notificationOption);
  });