import React from 'react' ; 
import * as StoryDetails from '../Read/Story/Details' ;
import * as icons from 'react-icons/md';
import  * as mdb from "mdbreact";
import { ContentArea } from '../discover/DiscoverComps';
import { documentName } from '../Write/Story/Atts';
import db from "../database/db" ; 

function Aboutus()
{
    return(
        <div className = "container myshadow">
        <div className = "row">
            <div className = "col-md-3"style={{width:"30%",height:"100%", fontSize:"25px" , padding:"20px"}}>
                Here You can Create and Discover 
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
                <h3>Here the Famous Quote of the Month</h3>
                <div className= "container-inner famous" style ={{textAlign:"center" ,color:"white" , height:"300px"}}> 
                <h1><p>Create And Let Others Discover Your Achievements</p></h1>
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
                        "wait"
                            :<div className = "row container myshadow " style={{margin:"20px",  width:"95%" , backgroundColor:""}}>
                                <div className = "col-md-3"style={{width:"30%",height:"100%", fontSize:"25px" , padding:"20px"}}>
                                <a href= "ReadStory?title="><StoryDetails.CoverPage 
                                  imageAddress = {this.state.tabslist[0][0].coverid === ""? process.env.PUBLIC_URL+"ScribbleBow.png" :this.state.tabslist[0][0].coverid  }
                        /></a>
                                </div>
                                <div className= "col-md-8" style={{height:"100%",color:"", padding:"20px"}} >
                                    <StoryDetails.StoryDetails
                                        myid = {this.state.tabslist[0][1]} 
                                        Details = {this.state.tabslist[0][0]}
                                        title = {this.props.title}
                                        Comments = {[]}
                                        Liked = {false}
                                    />
                                </div>
                        </div>
                }
                
                <h3>Trending</h3>
                <ContentArea  cmsg= {this.props.title} category= {documentName[this.props.title] } type="famous"/>
            </div>
        );
    }
     
}

export default Aboutus ; 
export {Aboutus , FamousStories} ; 