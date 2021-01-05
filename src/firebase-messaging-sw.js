import * as firebase from 'firebase';
import db from '/Users/Chakri/ScribbleBow/scribblebow/src/database/db' ; 
// messages.
importScripts('https://www.gstatic.com/firebasejs/7.14.6/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.6/firebase-messaging.js');
  // Initialize Firebase
  const messaging=firebase.messaging();
  messaging.setBackgroundMessageHandler(function (payload) {
      console.log(payload);
      const notification=JSON.parse(payload);
      const notificationOption={
          body:notification.body,
          icon:notification.icon
      };
      return self.registration.showNotification(payload.notification.title,notificationOption);
  });