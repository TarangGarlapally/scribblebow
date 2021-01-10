import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router";
import { Username } from "../database/funcs";
import { AuthContext } from "../Auth";
import db from "../database/db";
import { MdLinkedCamera } from "react-icons/md";


export default function Test() {

    var currentLocation = window.location.pathname;
    const [email, setEmail] = useState("")
    // // f12fd4d5-1e50-45a2-a021-abcbe8ce8af5

    //     Email.send({
    //         SecureToken: "f1acbb1a-831a-408e-ad8c-670914a2de7c",
    //         To : 'taranggarlapally@gmail.com',
    //         From : "theconscienceofficial@gmail.com",
    //         Subject : "This is the subject",
    //         Body : "And this is the body"
    //     }).then(
    //       message => alert(message)
    //     );

    function handleChange(event) {
        const newemail = event.target.value;
        setEmail(newemail);
    }
    function checkEmail(event) {
        event.preventDefault();

        console.log(email);


    }

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



    const UserKey = function(){
        db.firestore().collection("users").get()
        .then(querySnapshot => {

            querySnapshot.forEach(doc => {
                console.log(doc.id);
                db.firestore().collection("myshelf").doc(doc.id).set({
                    stories:[],
                    poems:[],
                    quotes:[],
                    scripts:[],
                    fanfiction:[],
                    audio:[],
                    articles:[],
                });
            });
        });

    }


    const ContentNum = function(){
        db.firestore().collection("users").get().then((snapshot)=>{
            snapshot.forEach((snap)=>{

           
            var l = ["poems", "quotes", "audio", "scripts", "articles", "fanfiction", "stories"]
        l.forEach(element => {
            db.firestore().collection(element).where("creator","==",snap.id).where("published","==",true).get()
                .then(querySnapshot => {
                    var lst=0;
                    querySnapshot.forEach(doc=>{
                        lst+=1;
                    });
                    console.log(lst)
                    db.firestore().collection("users").doc(snap.id).update({
                        [element]: lst
                    });
                });
        });
    });
        });
    }

    const test=function(){
        db.firestore().collection("users").doc('taranggarlapally').get().then((doc)=>{
            if(doc.data().lname){
                console.log(doc.data().lname);
            }
            if(doc.data().ctitle){
                console.log(doc.data().ctitle);
            }else{
                console.log("doesn't exist");
            }
        })
    }

    const EditProfileimg = function () {
        
        
            db.firestore().collection("users").get()
                .then(querySnapshot => {

                    querySnapshot.forEach(doc => {
                      
                            const images = db.storage().ref().child('ProfileImages');
                            const image = images.child(doc.id);



                            image.getDownloadURL().then((url) => {


                                console.log(url);
                                db.firestore().collection("users").doc(doc.id).update({
                                    profileimg: url
                                });


                            });
                            
                        

                        //     if (typeof doc.data().hashtags == "string") { 
                        //     
                        // }
                    });
                });
        

    }

    const EditDB = function () {
        var l = ["poems", "quotes", "audio", "scripts", "articles", "fanfiction", "stories"]
        l.forEach(element => {
            db.firestore().collection(element).get()
                .then(querySnapshot => {

                    querySnapshot.forEach(doc => {
                        if (doc.data().title) {
                            const images = db.storage().ref().child('CoverPages');
                            const image = images.child(doc.id);



                            image.getDownloadURL().then((url) => {


                                console.log(url);
                                db.firestore().collection(element).doc(doc.id).update({
                                    coverid: url
                                });


                            });
                            
                        }

                        //     if (typeof doc.data().hashtags == "string") { 
                        //     
                        // }
                    });
                });
        });

    }


    const tname = "TargEj@jR.Com"

    return (

        <div className="login-bg">
            <div className="login-bar">
                <p>{currentLocation}</p>
                <a onClick={() => { UserKey() }}>click for subs</a>
                <p>{tname.toLowerCase()}</p>
                <form onSubmit={checkEmail}>
                    <input type="text" className="form-control" name="email" onChange={handleChange} id="email" placeholder="email" value={email} />
                    <input type="submit" name="submit" value="Check" />
                </form>

                <form >
                    <img className="signuplogo2" src={process.env.PUBLIC_URL + '/myimage.png'} />
                    <div className="form-group" style={{ width: "80%", margin: "20px" }}>
                        <label for="bio">Say something about yourself {}</label>
                        <input type="text" className="form-control" name="bio" id="bio" placeholder="Your Bio (Optional)" />
                    </div>
                    <div className="form-group" style={{ width: "80%", margin: "20px" }}>

                        <label for="title">Which role describles you the most?</label>
                        <select className="form-control" name="title" id="title"   >
                            <option>Creator (Default)</option>
                            <option>Writer</option>
                            <option>Poet</option>
                            <option>Speaker</option>
                            <option>Singer</option>
                            <option>Content Creator</option>
                            <option>Film Maker</option>
                        </select>
                    </div>
                    <div className="form-group submit" style={{ width: "80%", margin: "20px" }}>
                        <input type="submit" className="myshadow mybtn btn btn-default" id="signin" value="Save" />
                    </div>
                </form>
            </div>
        </div>);
}



// book tab with wood
// <div>
//     <div className = "" style = {{ backgroundColor:"" , justifyContent:"center" , display:"flex"}}>
//     <img className="sm-cover myshadow scaling" style={{position:"relative"}} src = {props.imageAddress} alt = "Cover "></img>
//     </div>
//     <div className= "container-inner myshadow wood" style={{ backgroundColor:"",position: "relative" , padding:"10px", margin:"20px",marginTop: "-10px"}}>
//     <div align="center" className="myshadow wood" style={{width:"140px", height:"5px", backgroundColor:"white"}}></div>
//     <h5 align="center" style={{marginTop:"5px",color: "white"}}>{props.title}</h5>
// </div></div>
