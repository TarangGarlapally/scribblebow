import React, { useEffect, useState } from "react";
import db from "./database/db";
import { useHistory } from "react-router";
import { Alert } from "react-bootstrap";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const history = useHistory();

    function Subs(ctitle) {
        var title = ctitle;
        title = title.split("");
        var l = title.length;
        var ss = [];
        for (var i = 0; i < l; i++) {
            var x = title[i];
            ss.push(x);
            for (var j = i + 1; j < l; j++) {

                x += title[j];
                ss.push(x);
            }

        }
        return ss;
    }


    function Add_to_db() {
        db.firestore().collection('myauth').doc(localStorage.getItem("uid")).get()
            .then((docSnapshot) => {
                if (docSnapshot.exists) {
                    //do nothing
                } else {
                    db.firestore().collection('users').doc(localStorage.getItem("username")).get()
                        .then((docSnapshot) => {
                            if (docSnapshot.exists) {
                                const uname = localStorage.getItem("username");
                                localStorage.setItem("username", uname + Date.now());
                            }
                        });
                    var tname = localStorage.getItem("fname") + " " + localStorage.getItem("lname");
                    tname = tname.toLowerCase();
                    const userkeys = Subs(tname);

                    db.firestore().collection('users').doc(localStorage.getItem("username")).set({
                        bio: "I am a Creator(Default)",
                        email: localStorage.getItem("email"),
                        fname: localStorage.getItem("fname"),
                        gender: "",
                        lname: localStorage.getItem("lname"),
                        title: "Creator(Default)",
                        userkeys: userkeys,
                        nfollows: 0,
                        nfollowers: 0,
                        stories: 0,
                        poems: 0,
                        quotes: 0,
                        scripts: 0,
                        fanfiction: 0,
                        audio: 0,
                        articles: 0,
                        uid: localStorage.getItem("uid")
                    }); // create the user
                    db.firestore().collection("myauth").doc(localStorage.getItem("uid")).set({
                        username: localStorage.getItem("username")
                    });
                    db.firestore().collection("follows").doc(localStorage.getItem("username")).set({
                        follows: []
                    });
                    db.firestore().collection("followers").doc(localStorage.getItem("username")).set({
                        followers: []
                    });
                    db.firestore().collection("myshelf").doc(localStorage.getItem("username")).set({
                        stories:[],
                        poems:[],
                        quotes:[],
                        scripts:[],
                        fanfiction:[],
                        audio:[],
                        articles:[],
                    });
            
                }
            });
    }

    function fName(nameArray) {
        var i;
        var p = " ";
        var fname = "";
        for (i = 0; i < nameArray.length - 1; i++) {
            if (i == nameArray.length - 2) {
                p = "";
            }
            fname += nameArray[i] + p;
        }
        return fname;
    }

    useEffect(() => {

        db.auth().onAuthStateChanged((user) => {
            setCurrentUser(user);
            try {
                const custom_id = user.email.split("@")[0];
                const nameArray = user.displayName.split(" ");
                localStorage.setItem("email", user.email);
                localStorage.setItem("lname", nameArray[nameArray.length - 1]);
                localStorage.setItem("fname", fName(nameArray));
                localStorage.setItem("username", custom_id);
                localStorage.setItem("uid", user.uid);

                Add_to_db();
            } catch (error) {

            }


        });

    }, []);

    return (<AuthContext.Provider
        value={{
            currentUser
        }}>
        {children}
    </AuthContext.Provider>
    );
};