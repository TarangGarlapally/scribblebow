import * as firebase from "firebase/app";
import '@firebase/messaging' 
import "firebase/auth";
import { AuthContext } from "../Auth";
import { useContext } from "react";




const db = firebase.initializeApp({
    
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
    databaseURL:  process.env.REACT_APP_FIREBASE_DATABASE,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
    appId: "1:922017979428:web:ddd59926e9587dffa50cb1",
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
});


// const messaging = firebase.messaging() ; 

// messaging.usePublicVapidKey("BPI4TcoeyYAB0d8whsM0PMJoAZFeVQeSNwBidPwIGMZnPh7IMuyPkXcsSHTRYATajoMnMF6uTaKimpMd04ElNX4") ; 
// messaging.requestPermission().then(()=>{
//     console.log("permission Granted") ; 

//     messaging.getToken().then(function(currentToken){
//         console.log(currentToken) ; 
//     }).catch(function(error){
//         console.log(error) ; 
    
//     })
// })

// messaging.onMessage(function(payload){
//     var obj = JSON.parse(payload.data.notification) ; 
//     var notification = new   Notification(obj.title, {
//         icon :obj.icon , 
//         body: obj.body 
//     }); 
//     //...
// }); 



export default db;