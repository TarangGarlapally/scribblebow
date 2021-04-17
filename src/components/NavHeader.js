import React from 'react' ; 
import Navbar from './navbar' ; 
import { useHistory } from 'react-router';


function Header(props)
{
   
    const history =useHistory();
    return (
        <div className="nocopy">
            <div className= "header row myheader">
            {props.logged===0?<img className="header-logo" alt="header logo" onClick = {()=>history.push("/")} src={process.env.PUBLIC_URL + '/myimage.png'} />:<h1>{props.title.toUpperCase()}</h1>}
                
                {props.logged===0?<a className="lgsg" href="/Log0">LOGIN/SIGNUP</a>:null}
                
              
            </div>
            {props.logged===0?null:<Navbar  Username = {localStorage.getItem("username")}/>}
           
        </div>
    
        
    ); 
}
export default Header ; 