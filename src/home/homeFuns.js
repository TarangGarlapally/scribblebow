import React, { useState } from 'react' ; 
import * as StoryDetails from '../Read/Story/Details' ;
import * as icons from 'react-icons/md';
import  * as mdb from "mdbreact";
import { ContentArea } from '../discover/DiscoverComps';
import { documentName } from '../Write/Story/Atts';
import {  useHistory } from "react-router";
import db from "../database/db" ; 

function Aboutus()
{

    const [topquote,setTopQuote] = useState("Loading Top Quote...");
    const [creator,setCreator] = useState("");
    const [qId,setQId] = useState("");
    const history = useHistory();
    db.firestore().collection("quotes").where("published", "==", true).orderBy("nlikes","desc").limit(1).get().then(snapshot => {
        snapshot.forEach(data=>{
        setTopQuote(data.data().quotecontent);
        setCreator(data.data().creator);
        setQId(data.id);
        })
    })
    return(
        <div className = "container myshadow">
        <div className = "row">
            <div className = "col-md-3"style={{width:"30%",height:"100%", fontSize:"25px" , padding:"20px"}}>
               <br />Create and get discovered...
                <ul>
                    <li>Story</li>
                    <li>Poems</li>
                    <li>Audio</li>
                    <li>Blogs</li>
                    <li>Artiles</li>
                    <li>Quotes</li>
                </ul>
            </div>
            <div className= "col-md-8" style={{height:"100%",color:"", padding:"20px"}} >
                <h3>TOP QUOTE OF THE DAY</h3>
                <div className= "container-inner famous" style ={{textAlign:"center" ,color:"white" , height:"300px"}}> 
                <br /><br /><h4 className="pointer" onClick={()=>{
                        history.push({
                            pathname:"/ReadQuote", 
                            search: "?title=Quote&QuoteId="+ qId, 

                        })
                }} id="topquote">{topquote}</h4>
                <br /><h4 className="pointer" onClick={()=>{
                        history.push({
                            pathname:"/Profile", 
                            search: "?UserId="+ creator, 

                        })
                }} id="topquote">{creator===""?"":"- "+creator}</h4>
                </div>
                
            </div>
            
            </div>
            
        </div>);
       
        
} 


function Tabs(props)
{
    return (
    <div className= "container-inner myshadow" style={{ width:"160px", backgroundColor:"white",position: "relative" , padding:"20px", margin:"20px"}}>
    <div className = "" style = {{ backgroundColor:"" , justifyContent:"center" , display:"flex"}}>
    <img className="sm-cover" style={{position:"relative"}} src = {props.imageAddress} alt = "Cover "></img>
    </div>
    
    <h5 align="center" style={{marginTop:"20px"}}>{props.title}</h5>
    
</div>) ; 
}
class FamousStories extends React.Component
{
    constructor(props)
    {
        super(props) ; 
        this.state = { tabslist: [], stage: 0  };
    }

    shouldComponentUpdate( nextProps, nextState)
    {
        if(this.props === nextProps 
            && this.state.tabslist.length === nextState.tabslist.length
            &&this.state.stage === nextState.stage) return false ; else return true  ; 
    }
    render(){
        console.log(this.state.tabslist , "this is the Tablist");
        var tabslist = [];
        db.firestore().collection(documentName[this.props.title]).where("published","==",true).limit(1).get().then((snapshot) => {
            snapshot.forEach((doc) => {
                
                tabslist.push([doc.data(), doc.id, this.props.title]);
            });
            
            this.setState({ tabslist: tabslist, stage:4})
        });

        return (
            <div className="container">
                <h1 className="" style={{backgroundColor:""}}>{this.props.title.toUpperCase()}</h1>
                <hr></hr>
                {
                    this.state.stage === 0 ? 
                        null
                            :<div className = "row container myshadow " style={{margin:"20px",  width:"95%" , backgroundColor:""}}>
                                <div className = "col-md-3"style={{width:"30%",height:"100%", fontSize:"25px" , padding:"20px"}}>
                                <a href= { "ReadStory?title="+ this.props.title + "&StoryId="+ this.state.tabslist[0][1] } ><StoryDetails.CoverPage 
                                  imageAddress = {this.state.tabslist[0][0].coverid === ""? process.env.PUBLIC_URL+"ScribbleBow.png" :this.state.tabslist[0][0].coverid  }
                        /></a>
                                </div> 
                                 <div className= "col-md-8" style={{height:"100%",color:"", padding:"20px"}} >
                                    <StoryDetails.StoryDetails
                                        id = {this.state.tabslist[0][1]} 
                                        Details = { {...this.state.tabslist[0][0] , myid:this.state.tabslist[0][1]}   }
                                        title = {this.props.title}
                                        Comments = {[]}
                                        Liked = {false}
                                    />
                                </div>
                        </div>
                }
                
                <h3>Trending</h3>
                <ContentArea  cmsg= {this.props.title} category= {documentName[this.props.title] } setPlayAudio={this.props.title==="Audio"?this.props.setPlayAudio:null} type="famous"/>
            </div>
        );
    }
     
}

export default Aboutus ; 
export {Aboutus , FamousStories} ; 