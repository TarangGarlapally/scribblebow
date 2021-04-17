import React,{useCallback,  useState} from 'react';
import { Redirect} from "react-router";
import db from "../database/db";
import firebase from 'firebase';
import Header from '../components/Header';
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

function Login({history}) {
    const [acheck,setAcheck] = useState(0);
    const [bcheck,setBcheck] = useState(0);
    const [fpass, setFpass] = useState(0);
    const [tmreq,setTMreq] =useState(0);

    const handleLogin = useCallback(
        async event =>{
            event.preventDefault();
            const {email, password} =event.target.elements;
            try{
                await db
                .auth()
                .signInWithEmailAndPassword(email.value.toLowerCase(), password.value);
               
                history.push("/Log0");
            }catch (error){
                if(error.code==="auth/user-not-found"){
                    setBcheck(0);
                    setAcheck(2);
                }
                if(error.code === "auth/wrong-password"){
                    setAcheck(0)
                    setBcheck(2);
                }
            }
            },[history]                
    );




    if(localStorage.getItem("username")){
       return <Redirect to="/" />;
    }

    const handleFpass = function(event){
        setTMreq(0);
       const Email = event.target.email.value;
       db.auth().sendPasswordResetEmail(Email.toLowerCase())
              .then(function (user) {
                setFpass(4);
              }).catch(function (e) {
                if(e.code=== "auth/too-many-requests"){
                    setTMreq(2);
                }
              });
              return false;
              
    }

    const uiConfig = {
        signInFlow: "popup",
        
        signInOptions:[
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        ],
        signInSuccessUrl: "/",
        callbacks: {
            signInSuccessWithAuthResult: ()=> true
        }
    }


    const logging = <form onSubmit={handleLogin}>
    <div className="form-group" style={{ width: "80%", marginTop: "40%" }} >
        <input type="text" className="form-control" id="email" placeholder="Enter Your Email" required/>
    </div>
        <div className="form-group" style={{ width: "80%" }}>
            <input type="password" className="form-control" id="password" placeholder="Enter Your Password" required/>
        </div>
        {(acheck===2)?<p className="font0" style={{color: "red"}}>It seems you don't have an account</p>: null}
        {(bcheck===2)?<p className="font0" style={{color: "red"}}>The password you entered is wrong, or you may not have a password</p>: null}
        <div className="form-group submit" style={{ width: "80%"}}>
            <input type="submit" className="myshadow mybtn btn btn-default" id="signin" value="Login" />
        </div>
       </form>;

    const forgotpass =  <div><form onSubmit={handleFpass}>
    
    <div className="form-group" style={{ width: "80%", marginTop: "40%" }} >
    <p>We'll send you a link to reset your password</p>
    <input type="text" className="form-control" id="email" placeholder="Enter Your Email" required/>
   </div>
   <div className="form-group submit" style={{ width: "80%"}}>
    <input type="submit" className="myshadow mybtn btn btn-default" id="signin" value="Send Reset Link" />
    
   </div>
  
    </form>
    {tmreq===0?null:<p className="font0" style={{color: "red"}}>Too many requests</p>}
    </div>;
    const mainlog = <div>
         {fpass===0?logging:forgotpass}
           {fpass===0?<a href="#" className="forgot-pass font0" onClick={()=>setFpass(2)}>Forgot Password</a>:null}
    </div>

    return (<div>
    <Header title="Login"/>
    <div className="login-bg">
        <div className="login-bar">

            <div className="col-md-6" style={{ paddingLeft: "4%" }}> 
            <img className="loginlogo" alt = "logo" src={process.env.PUBLIC_URL + '/myimage.png'}/>
           {fpass===4?<p style={{marginTop:"60px"}}>We've mailed you the link to reset your password. Please reset your password using the link.</p>:mainlog}
          
               </div>
            <div className="col-md-6 social-login" > 
            <div className="sl-top">
                
            </div>
            <div className="sl-bottom">
            <StyledFirebaseAuth 
                uiConfig={uiConfig}
                firebaseAuth = {firebase.auth()}
            />
            
            <hr className="hr"/><p className="f">Don't have an account yet?</p>
            <button type="submit" className="mybtn sl btn btn-lg btn-default myshadow"  onClick={()=> history.push('/signup')}>Signup</button>
            </div>
            </div>
        </div>
    </div>
    </div>);
}

export default Login;