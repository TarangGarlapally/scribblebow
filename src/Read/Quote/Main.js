import React from 'react' ; 
import Quote from './QuoteComponents';
import db from '../../database/db'; 
import { documentName } from '../../Write/Story/Atts';
import { Redirect} from "react-router-dom";
import Header from '../../components/NavHeader';
import { LoadingPage } from '../../components/Loading';
import * as Atts from "../../Write/Story/Atts"; 
export default class ReadQuote extends React.Component
{
    constructor(props)
    {
        super(props) ; 
        this.state  = { QuoteDetails :{} , id :"", stage :" " , preLiked : false , myshelf : false}
    }

    shouldComponentUpdate(nextProps , nextState )
    {
         if(this.props === nextProps &&  this.state.id === nextState.id && this.state.stage ===  nextState.stage) return false  ; 
         else return true  ; 
    }
    getQuoteDetails(collecName , QuoteId)
    {
        db.firestore().collection(collecName).doc(QuoteId).get().then(qs =>{

            let tempdata = { 
                QuoteContent : qs.data().quotecontent , 
             ...qs.data(), 
            }

            this.setState({ QuoteDetails: tempdata  , id : qs.id    }) ; 
        })
    }

    CheckLiked(QuoteId)
        {
            console.log("checked Liked")
            db.firestore().collection("likes")
            .doc(QuoteId)
            .get()
            .then(querysnapshot =>{
                if(querysnapshot.exists)
                   {
                       let likedUsers = querysnapshot.data().usernames; 
                       console.log(likedUsers) ;
                       let val = likedUsers.find(e => e === localStorage.getItem('username')); 
                       this.setState({preLiked:val!=null , stage:4 });  
                       console.log("setting to 4 ")
                   }
                else 
                {
                    this.setState({preLiked:false , stage:4 });  
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
              
                let title = new URLSearchParams(this.props.location.search).get("title") ; 
                let myshelf = title==="Audio"?qs.data().audio:qs.data().quotes; 
                
                console.log(myshelf)
                console.log("Setting the MySHELF " , this.state.myshelf); 
                myshelf.forEach(eachStory=>{
                    if(eachStory === StoryId)
                    {   
                        this.setState({myshelf : true}) ; 
                    }

                })
               

            })
        }
    render()
    {
        if(!localStorage.getItem("username") ){
            return <Redirect to={"/Log0"} />;
        }
        const title = new URLSearchParams(this.props.location.search).get("title");
        var allProps = {
            "title": title, 
            "id": title==="Quote"?new URLSearchParams(this.props.location.search).get("QuoteId"):new URLSearchParams(this.props.location.search).get("StoryId"),
        }  ;
        console.log(allProps);
        this.getQuoteDetails(Atts.documentName[allProps.title],allProps.id) ;
        this.CheckMyShelf(allProps.id)
           
        this.CheckLiked(allProps.id);
        if(this.state.stage === 0 )
        {
                return <LoadingPage message = "Loading Content" />
        }
        else if(this.state.stage === 4 )
        {
            return(
                <div>
                    <Header title = {allProps.title} />
                    <Quote 
                    Details = {this.state.QuoteDetails}
                    QuoteId  = {allProps.id}
                    title = {allProps.title}
                    preLiked  = {this.state.preLiked}
                    myshelf = {this.state.myshelf}
                    setPlayAudio = {this.props.setPlayAudio}
                />
                </div>
               
            )     
        }
        else 
        {
            return <LoadingPage message = "Loading Content" />
        }
        
    }  
    
}