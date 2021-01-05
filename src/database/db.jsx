import * as firebase from "firebase/app";
import '@firebase/messaging' 
import "firebase/auth";
import { AuthContext } from "../Auth";
import { useContext } from "react";




const db = firebase.initializeApp({
    apiKey: "AIzaSyDxA7cvyf0YgPGc4MzzfKo_xy6QJuiBahc",
    authDomain: "scribblebow.firebaseapp.com",
    databaseURL: "https://scribblebow.firebaseio.com",
    projectId: "scribblebow",
    storageBucket: "scribblebow.appspot.com",
    messagingSenderId: "922017979428",
    appId: "1:922017979428:web:ddd59926e9587dffa50cb1",
    measurementId: "G-ZT8E0PS2Z2"
  });





export default db;