import WriteStory from './Story' ;
import React from 'react' ;  
import * as Atts from "./Atts" ; 
import db from '../../database/db'; 
import {LoadingPage} from '../../components/Loading';
/* This is the main page for the Write Story 
the Other pages redirect to this page with three properties
1. StoryId , title , new/notNew
if the story is new we  retrive the data from the database else we wont */ 
class WriteTheStory extends React.PureComponent{
    constructor(props)
    {
        super(props) ;
        this.state = { StoryDetails:{
            "id":"",
            "StoryTitle" : this.props.location.state.title+" Title", 
            "StoryFont":"",
            "StoryFontSize":"20" , 
            "StoryContent": "", 
            "StoryGenre": "" ,
            "StoryHashtags":"",
            "StoryDescription":"",
            "StorySeries":"",
            "part":0,
            "nlikes":0,
            "ncomments":0,
            "creator":"",
            "PublishSave" : true , 
            "ArticleType":"Personal Blog",
            "FictionBasedOn":"",
            "published":false
        }, stage:0 ,  "StoryCoverPage" :process.env.PUBLIC_URL+"ScribbleBow.png" ,  }
    }
    shouldComponentUpdate(nextProps , nextState)
    {
        if(this.props === nextProps &&this.state.StoryDetails.id === nextState.StoryDetails.id && this.state.stage === nextState.stage) return false ; else return true ; 
        
        
    }
    GetStoryDetails = function  (collecName, StoryId)
        {
         
            console.log("Getting Story Details "+collecName+StoryId); 
            const snapshot = db.firestore()
            .collection(collecName).doc(StoryId)
            .get()
            .then(querySnapshot => {

                
                var sep ={
                    "id": querySnapshot.id ,
                    "StoryTitle" : querySnapshot.data().title, 
                    "StoryFont":querySnapshot.data().font,
                    "StoryFontSize":"20" , 
                    "StoryContent": querySnapshot.data().content, 
                    "StoryGenre": querySnapshot.data().genre,
                    "StoryHashtags":querySnapshot.data().hashtags,
                    "StoryDescription":querySnapshot.data().description,
                    "StorySeries":"",
                    "part":querySnapshot.data().part,
                    "creator":querySnapshot.data().creator,
                    "collab":("collab" in  querySnapshot.data())?querySnapshot.data().collab:"",
                    "nlikes":querySnapshot.data().nlikes,
                    "ncomments":querySnapshot.data().ncomments,
                    "PublishSave" : false , 
                    "ArticleType": ("type" in  querySnapshot.data())?querySnapshot.data().type:"Personal Blog",
                    "FictionBasedOn":("basedOn" in  querySnapshot.data())?querySnapshot.data().basedOn:"",
                    "published":querySnapshot.data().published,
                }   ;

                if(this.props.location.state.part!= null)
                 sep= {...sep , "part":this.props.location.state.part , "StorySeries":this.props.location.state.SeriesId }

                console.log("setting the Story data")
                     this.setState({StoryDetails: sep, StoryCoverPage: querySnapshot.data().coverid , stage:4 }) ; 
                    
                }
                )
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
            //console.log("Returning the Story Details"); 
            
             
        }
    render()
    {
        if(!this.props.location.state.new) {
            this.GetStoryDetails(Atts.documentName[this.props.location.state.title], this.props.location.state.id) ;
        if(this.state.stage ==4 )
            return (<div><WriteStory 
            StoryDetails ={this.state.StoryDetails} 
            new = {this.props.location.state.new} 
            title={this.props.location.state.title}
            StoryCoverPage={this.state.StoryCoverPage} /></div>) ;
        if(this.state.stage == 0 )
          return(<div><LoadingPage message="Loading Content" /></div>); 


        }
        else  {
            return (<div><WriteStory StoryDetails ={ this.props.location.state.title ==="Article"?{

                ...this.state.StoryDetails , 
                "StoryContent": new Date().toLocaleString()+","
            } :this.state.StoryDetails} 
            StoryCoverPage = {this.state.StoryCoverPage}
            new = {this.props.location.state.new} title={this.props.location.state.title} /></div>) ;} 
    }
}

export default WriteTheStory ; 