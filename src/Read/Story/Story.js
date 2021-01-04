import React, { useState } from 'react' ; 
import Header from '../../components/NavHeader' ; 
import * as p from './Details' ; 
import * as Files from '../../Storage/UploadFile' ; 
import * as Story from '../../database/StoryFuns';
import * as Atts from "../../Write/Story/Atts";  
import Loading from '../../components/Loading';
import db from "../../database/db";
import "firebase/auth";
import 'firebase/storage';
import * as firebase from 'firebase';

class ReadStory extends React.PureComponent{
    
    
    constructor(props)
    {
         super(props) ;
         this.state = {StoryDetails:{
             "myid":"",
             
         } , imageAddress: process.env.PUBLIC_URL+"ScribbleBow.png" ,
         AllStoryComments:{ comments:[]},
         stage:0,
         collab:"",
        Liked:false , 
        myShelf:false  } ; 
            
    }
           
    shouldComponentUpdate(nextprops , nextState)
    {
        
        
        
        
        console.log( this.state.AllStoryComments.comments.length=== nextState.AllStoryComments.comments.length) ; 
        console.log(this.state.Liked === nextState.Liked)
        if(this.props == nextprops 
            && this.state.StoryDetails.myid === nextState.StoryDetails.myid 
            && this.state.Liked === nextState.Liked
            && this.state.stage == nextState.stage
            && this.state.myShelf === nextState.myShelf)
             return false ; 
        else return true ; 
    }

    GetStoryDetails = function  (collecName, StoryId)
        {
         

            const snapshot = db.firestore()
            .collection(collecName).doc(StoryId)
            .get()
            .then(querySnapshot => {

                console.log(querySnapshot); 
                var sep = {
                    ...querySnapshot.data(),
                    "myid": querySnapshot.id 
                   }     ;
                    this.setState({StoryDetails: sep } ) ; 
                   
                   
                     
                }
                )
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
            //console.log("Returning the Story Details"); 
            
             
        }
        CheckLiked(StoryId)
        {
            console.log("checked Liked")
            db.firestore().collection("likes")
            .doc(StoryId)
            .get()
            .then(querysnapshot =>{
                if(querysnapshot.exists)
                   {
                       let likedUsers = querysnapshot.data().usernames; 
                       console.log(likedUsers) ;
                       let val = likedUsers.find(e => e === localStorage.getItem('username')); 
                       setTimeout(2000 , ()=>{}) ;
                       this.setState({Liked:val!=null , stage:4 });  
                       console.log("setting to 4 ")
                   }
                else 
                {
                    this.setState({Liked:false , stage:4 });  
                }
            }).catch(error =>{
                console.log(error) ;console.log("NO COmmetns"); 
                this.setState({stage:4})
            }); 
        }
        CheckMyShelf(StoryId)
        {
            db.firestore().collection("myshelf").doc(localStorage.getItem('username'))
            .get()
            .then(qs=>{
                let myshelf ; 
                let title = new URLSearchParams(this.props.location.search).get("title") ; 
                switch(title)
                {
                    case "Story" : myshelf = qs.data().stories ;  break   ; 
                    case "Poem" : myshelf = qs.data().poems ; break  ; 
                    case "Audio": myshelf = qs.data().audio ; break  ; 
                    case "fanFiction": myshelf = qs.data().fanfiction ; break  ;
                    case "Script": myshelf = qs.data().scripts ; break  ;
                    case "Article": myshelf = qs.data().articles ; break ;
                    default : myshelf = qs.data().stories ; break  ;   

                }
                console.log(myshelf)
                console.log("Setting the MySHELF " , this.state.myShelf , StoryId); 
                myshelf.forEach(eachStory=>{
                    if(eachStory === StoryId)
                    {   
                        this.setState({myShelf : true}) ; 
                        console.log("Setting the MySHELF inside " , this.state.myShelf); 
                    }

                }); 
               

            })
        }

    render(){

        var allProps = {
            "title": new URLSearchParams(this.props.location.search).get("title"), 
            "id": new URLSearchParams(this.props.location.search).get("StoryId")
        }  ;
        console.log(allProps);
        this.GetStoryDetails(Atts.documentName[allProps.title],allProps.id) ;
        this.CheckMyShelf(allProps.id)
           
            this.CheckLiked(allProps.id);
        
         
        if(this.state.stage === 4)
    {
        return (
            <div>
                 
                <Header title = {allProps.title} />
                <div className = "container">
                    <div className= "row">
                        <p.CoverPage 
                        imageAddress = {this.state.StoryDetails.coverid !="" ? this.state.StoryDetails.coverid : this.state.imageAddress}
        
                        />
                        <p.default 
                        id = {allProps.id} 
                        Details = {this.state.StoryDetails}
                        title = {allProps.title}
                        Liked = {this.state.Liked}
                        myShelf = {this.state.myShelf}
                        />
                       
                    </div>
                    
                        <p.StoryContent
                        id = {allProps.id} 
                             Details = {this.state.StoryDetails}
                        />
                    
                   
                </div>
            </div>
            ); 
    }
    else
    {
       return( <Loading message="Loading"/>); 
    }
    
    }

    
}

export default ReadStory ; 