import React, { useContext } from "react";
import { AuthContext } from "../Auth";
import Gravatar from 'react-gravatar'
import Header from '../components/NavHeader' ; 
import * as funs from "./homeFuns";
// import { categoryAvailable } from "../Write/Story/Atts";

function Home(props){
    const {currentUser} = useContext(AuthContext);
    var aboutUs = <funs.default/> ; 
    var currentLocation = window.location.pathname;
    var logged=0;
    if(localStorage.getItem("username")){
        logged=1;
    }
    var categoryAvailable = ["Story","Poem" , "Article" , "Fanfiction", "Audio"];  
    return (

        
        <div>
        
           <Header title="HOME" logged={logged}/> 
          
          
          {aboutUs}
          {categoryAvailable.map(eachCat =>{ return( <funs.FamousStories title={eachCat} setPlayAudio={eachCat==="Audio"?props.setPlayAudio:null}/> ) ; })}
           
        </div>
); 
}

export default Home;