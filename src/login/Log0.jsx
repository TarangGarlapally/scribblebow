import React, { useContext } from "react";
import { AuthContext } from "../Auth";
import { Username, UserUid } from "../database/funcs";
import { Redirect, useHistory } from "react-router";
import Loading from "../components/Loading";
import IntitalizeFireBaseMessaging from "../Notifications/client";

export default function Log0(){
    const {currentUser} = useContext(AuthContext);
    const history = useHistory();
    if(currentUser){
        const name = Username();
        const uid=UserUid();
        
        if(name===null){
            return <Redirect to="/" />;
        }else{
            localStorage.setItem("username", name);
            localStorage.setItem("uid", uid );
            localStorage.setItem("emailverif",currentUser.emailVerified);
            localStorage.setItem("email",currentUser.email);
        }
        
        setTimeout(function(){
            if(localStorage.getItem("emailverif")=="true"){
                IntitalizeFireBaseMessaging() ; 
                history.push("/");
            }
            else{
                history.push("/unverif");
            }
            
        }, 2000);
        return <div>
        
        <Loading message={"Logging you in..."}/>
        </div>
    }
    else{
        return <Redirect to="/login" />;
    }
}