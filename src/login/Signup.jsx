import React,{useCallback, useState, useContext} from 'react';
import {withRouter, Redirect, useHistory} from "react-router";
import db from "../database/db";
import { UserUid } from '../database/funcs';
import { AuthContext } from '../Auth';
import Pref0 from './Pref0';
import Header from '../components/Header';
import { StyledFirebaseAuth } from 'react-firebaseui';
import firebase,{ app } from 'firebase';
import axios from 'axios';

function Signup(props) {
    
    const [newuser,setUser] = useState({
        fname: "",
        lname: "",
        gender: "",
        title: "Creator (Default)",
        email: "",
        testpass: "",
        password: "",
        uid: "",
        bio: "I am a Creator (Default)",
    });
    const [stage,setStage] = useState(0);
    const [pcheck,setPcheck] = useState(0);
    const [ucheck,setUcheck] = useState(0);
    const history = useHistory();
 

    if(props.ucheck === 2){
        setUcheck(2);
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


    function handleChange(event){  
        const {name,value} = event.target;

        setUser(prevValue =>{
            return {
                ...prevValue,
                [name] : value
            };
        });
    }

    const handleNext = function(event){
        event.preventDefault();
        setStage(stage+1);
    }


    const createUser = async function(){
        try{
            await db
            .auth()
            .createUserWithEmailAndPassword(newuser.email.toLowerCase(), newuser.password);
        }catch (error){
            if(error.code==="auth/email-already-in-use")
            {
                alert("Account with this email already exists, please refresh the page to sign in or sign up with another email")
            }
            history.push("/signup");
        }   
    }



   


    const handleNext2 = function(event){
        setPcheck(0);
        event.preventDefault();
        if(newuser.testpass===newuser.password){
            if(newuser.password.length>=8){
                createUser();
                setStage(4);
            }else{
                setPcheck(2);
            }
            
        }else{
            setPcheck(1);
        }
    }
    const handleAutoPassword = async function (){
        var testpass = document.getElementById("testpass");
        var password = document.getElementById("password") ; 
        
          const url = 'https://spring-feather-5dc4.karthik-pasupulatei.workers.dev?https://passwordgenerator-api.herokuapp.com/get-pwd';

          // request data object
          const data ="name=Tarang" ;
  
          // set the headers
          const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
          };
  
          const reqPass = await axios.post(url, data, config);
        if(reqPass.status === 200 && reqPass.data.password){
            testpass.value  = reqPass.data.password ; 
            password.value = reqPass.data.password ; 
            //console.log(testpass.value); 
        }
        else {
            var autopass = document.getElementById("autopass") ; 
            autopass.innerHTML = "sry! password could not be generated" ; 
            autopass.style.color = "red" ; 
            autopass.style.textDecoration = "none" ;
            autopass.onClick = null ; 
            //console.log(reqPass , reqPass.data.error); 
        } 
    }




    


    var signapp;

    if(stage===0 || ucheck===2){
        signapp =  (
            <form onSubmit={handleNext}>
                <div className="form-group" style={{ width: "80%", marginTop: "40%" }} >
                    <label for="fname">First Name</label>
                    <input type="text" className="form-control" name="fname" id="fname" onChange={handleChange} placeholder="Enter Your First Name"  value={newuser.fname} required/>
                </div>
                <div className="form-group" style={{ width: "80%" }}>
                    <label for="lname">Last Name</label>
                    <input type="text" className="form-control" name="lname" id="lname" onChange={handleChange} placeholder="Enter Your Last Name"  value={newuser.lname} required/>
                </div>
                <div className="form-group" style={{ width: "80%" }}>
                    <label for="email">Your Email</label>
                    <input type="email" className="form-control" name="email" id="email" onChange={handleChange} placeholder="Enter Your Email ID"  value={newuser.email} required/>
                </div>
                {(ucheck===2)?<p className="font0" style={{color: "red"}}>Email already in use</p>: null}
                <div className="form-group">
                    <label for="gender">Choose You Gender</label>
                    <select className="form-control" name="gender" id="gender" onChange={handleChange}  value={newuser.gender}>
                        <option>Prefer not to say</option>
                        <option>male</option>
                        <option>female</option>
                    </select>
                </div>
                <div className="form-group submit" style={{ width: "80%" }}>
                    <input type="submit" className="myshadow mybtn btn btn-default" id="signin" value="Next" />
                </div></form>);
    }



    else if(stage===1)
    {
        signapp = (
            <form onSubmit={handleNext2}>
                <div className="form-group" style={{ width: "80%", marginTop: "40%" }}>
                    <label for="testpass">Create a password</label><br/>
                    <a className = "handy" id = "autopass" onClick = {handleAutoPassword}>auto-generate</a>
                    <input type="password" className="form-control" name="testpass" id="testpass" onChange={handleChange} placeholder="Enter a password"  value={newuser.testpass} required/>
                </div>
                <div className="form-group" style={{ width: "80%" }}>
                    <label for="password">Verify your password</label>
                    <input type="password" className="form-control" name="password" id="password" onChange={handleChange} placeholder="Re-enter the password"  value={newuser.password} required/>
                </div>
                {(pcheck===1)?<p className="font0" style={{color: "red"}}>Passwords don't match</p>: null}
                {(pcheck===2)?<p className="font0" style={{color: "red"}}>Passwords should be atleast 8 characters long</p>: null}
              
                <div className="form-group submit" style={{ width: "80%" }}>
                    <input type="submit" className="myshadow mybtn btn btn-default" id="signin" value="Next" />
                </div>
            </form>
        );
    }

   













    
    if(stage===4){
        return <Pref0 newuser={newuser} />
    }else{
    return <div>
    <Header title="SIGNUP"/> 
    <div className="login-bg">
    <div className="login-bar">
        <div className="col-md-6" style={{ paddingLeft: "4%" }}> 
        <img className="signuplogo" src={process.env.PUBLIC_URL + '/myimage.png'}/>
        {signapp}
        </div>
            <div className="col-md-6 social-login" > 
            <div className="sl-top">
                
            </div>
            <div className="sl-bottom float-bottom">
            <StyledFirebaseAuth
                uiConfig={uiConfig}
                firebaseAuth = {firebase.auth()}
            />
            <hr className="hr"/><p className="f">Do you already have an account?</p>
            <button type="submit" className="mybtn sl btn btn-lg btn-default myshadow"  onClick={()=> history.push('/login')}>Login instead</button>
            </div>
            </div>
        </div>
    </div>
        </div>;
    
}
}

export default Signup;