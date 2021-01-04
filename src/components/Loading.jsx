import React from "react";
import Header from "./NavHeader";
import Header2 from "./Header";

function Loading(props){
    return <div>
    <Header2 title="Please Wait..."/>
    <div className="login-bg">
    <div className="login-bar2">
    <div className="col-md-6">
    <img  className= "loading" alt = "loading" src={process.env.PUBLIC_URL + '/loading-nobg.gif'}/>
    </div>
    <div className="col-md-6">
    <img className="signuplogo2" alt = "signup logo" src={process.env.PUBLIC_URL + '/myimage.png'}/>
    <p className="loading-text font0" id="loading-text">{props.message}</p>
    </div> 
    </div>
    </div>
    </div>
}
  
function LoadingPage(props)
{
    return(
        <div>
            {props.head==="no"?null:<Header title="Please Wait"/>}
            <div className="container " style={{display:'flex', justifyContent:"center"}}>
            <ul style={{listStyle:"none" , textAlign:"center" }}>
                <li><img alt = "loading" src = {process.env.PUBLIC_URL + "ripple-nobg.gif"} ></img></li>
                <li><h1>{props.message}</h1></li>
            </ul>
            
            
            </div>
           
        </div>
    )
}


function Caption(props)
{
    return(<span class="caption" style={{display:"block"}}>{props.caption}</span>) ; 
}

export default Loading;
export {Caption , Loading , LoadingPage} ; 