import React, { useState } from 'react' ; 
import {CoverPage} from '../Story/Details' ;
import * as Atts from '../../Write/Story/Atts'; 
import * as Canvas from 'react-canvas-js' ; 
import { Redirect, useHistory } from "react-router";
// Charts 
import ReactFC from 'react-fusioncharts';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import CategoryAll from './ProfileClasses';
import { UploadImage } from '../../Storage/UploadFile';
import db from '../../database/db';
import * as firebase from 'firebase';
import { Caption } from '../../components/Loading';
//end Charts 
//Dialog- Edit Profile
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import {EditProfileComp} from "../../Write/Profile/EditProfile";
//end dialog edit profile

export const UserDetails  = function (props)
{   
    
    var allprops = {
        ...props.Details 
        
    }; 
  
    console.log(props.IsUserFollowed, "Is UserFollowed") ; 
    const history = useHistory() ; 
    var currentUser = localStorage.getItem('username') ; 
    const [image , setImage] = useState(null) ; 
    var [UploadImageButton ,setUploadImageButton ] = useState("none"); 
    const [FollowButton , setFollowButton] = useState(props.IsUserFollowed); 
    const [open,setOpen] = useState(false);

    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
      });

      function handleClose(){
          setOpen(false);
          window.location.reload();
      }
    console.log(allprops.id)
    console.log(props.follows , "Follow Button")
    const [followCount , setFollowCount] = useState({
      "follows": allprops.nfollows,
      "followers": allprops.nfollowers, 
    }); 
    const [FinalUploadImage , setFinalUpload] = useState(null) ;  
    console.log(followCount)
    const [AnalyticsButton , setAnalytics] = useState(false) ; 
    //Here Comes the Follow Message Buttons 
    const FollowMessage = <div><button className={!FollowButton?"btn btn-primary":"btn btn-default"} style={{width:"45%" , margin:"10px",outline:"none"  }} onClick={handleFollowButton}>{FollowButton?"Unfollow":"Follow"}</button>
    <button className= "btn btn-default" style={{width:"45%",  margin:"10px" , marginRight:"0px"}}>Message</button></div> ;
    
    //Here Comes the Edit Profile Button
    const EditProfile =  <div><button className={ !AnalyticsButton?"btn btn-default": "btn btn-success" } style={{width:"45%" , margin:"10px",outline:"none" ,}}  onClick={handleAnalytics}>Analytics Mode</button>
    <button className= "btn btn-default" onClick={()=> {setOpen(true)}} style={{width:"45%",  margin:"10px" , marginRight:"0px"}}>Edit Profile</button></div> ;
    function handleUploadImageButton()
    {
      //upload the Image using the Upload file Fuction in storage
      UploadImage("ProfileImages/" , image , allprops.id , "users") ;
      setFinalUpload(image) ;  
      setUploadImageButton("none");
    }
    function handleFollowButton()
    {
       
      let val  ; 
      if(FollowButton)
      {
        //reove the user 
              
            val = - 1 ; 
            db.firestore().collection("follows").doc(localStorage.getItem('username')).update({
                follows: firebase.firestore.FieldValue.arrayRemove(allprops.id)
            });
            db.firestore().collection("followers").doc(allprops.id).update({
              followers: firebase.firestore.FieldValue.arrayRemove(localStorage.getItem('username'))
          });

          db.firestore().collection("users").doc(localStorage.getItem('username')).update(
            {
              "nfollows": firebase.firestore.FieldValue.increment(val)
            }
          ); 
          db.firestore().collection("users").doc(allprops.id).update({
            "nfollowers": firebase.firestore.FieldValue.increment(val)
          })
      }
      else 
      {
        //add 

                val = 1 ; 
                db.firestore().collection("follows").doc(localStorage.getItem('username')).update({
                  follows: firebase.firestore.FieldValue.arrayUnion(allprops.id)
              });
              db.firestore().collection("followers").doc(allprops.id).update({
                followers: firebase.firestore.FieldValue.arrayUnion(localStorage.getItem('username'))
            });

            db.firestore().collection("users").doc(localStorage.getItem('username')).update(
              {
                "nfollows": firebase.firestore.FieldValue.increment(val)
              }
            ); 
            db.firestore().collection("users").doc(allprops.id).update({
              "nfollowers": firebase.firestore.FieldValue.increment(val)
            })
        
      }
      setFollowButton(!FollowButton) ; 
      setFollowCount({
        ...followCount, 
        "followers": followCount.followers + val
      })
    }
    function handleImageChange(event)
    {
        let ImageFile =event.target.files[0] ;
        console.log("heyyyyy"); 
        console.log(ImageFile) ;   
        if(event.target.files[0])
        {
            
            console.log(ImageFile.size[0]) ; 
            setImage(ImageFile) ;
            const reader = new FileReader() ; 
            reader.addEventListener("load" , function(){
                var CoverPageElement = document.getElementById("previewImage") ; 
               
                CoverPageElement.setAttribute("src" , this.result) ; 
            }); 
            reader.readAsDataURL(ImageFile) ; 
            setUploadImageButton(""); 
         
        }
        
    }
    function handleFinalUpload()
    {
       
      console.log(FinalUploadImage) ;  
      if(FinalUploadImage !=null)
        {
            
            
            setImage(FinalUploadImage) ;
            const reader = new FileReader() ; 
            reader.addEventListener("load" , function(){
                var CoverPageElement = document.getElementById("previewImage") ; 
               
                CoverPageElement.setAttribute("src" , this.result) ; 
            }); 
            reader.readAsDataURL(FinalUploadImage) ; 
            setUploadImageButton("none"); 
         
        }
        else{

          var CoverPageElement = document.getElementById("previewImage") ; 
          CoverPageElement.setAttribute("src" , props.ProfileImageAddress) ; 
          let ImageFileInput  = document.getElementById("fileInput") ;
          ImageFileInput.value = null ; 
         
          console.log(ImageFileInput); 
          setUploadImageButton("none"); 

        }
        
    }
    function  handleAnalytics(event)
    {
      let UserWorks = document.getElementById("UserWorks") ; 
      let UserAnalytics =   document.getElementById("UserAnalytics") ; 
      if(AnalyticsButton)
        {
          UserWorks.style.display = "block" ; 
          UserAnalytics.style.display= "none" ;
        }
        else 
        {
           UserWorks.style.display = "none" ; 
           UserAnalytics.style.display= "block" ;
        }

        setAnalytics(!AnalyticsButton) ; 
    }

 
    var ProfileImage =  <div className= "col-md-3">
    <div className = "myshadow" style = {{width:160,maxWidth:160,height:277, justifyContent:"center"}}>
    <img  
    
    id = "previewImage" src ={props.ProfileImageAddress} alt = "Cover " style = {{maxWidth:160,height:277, maxHeight:"277"}}></img>
    </div>
 </div>

    var ChangeableProfileImage  = <div>
    <input type="file" 
    name = "StoryCoverPage"
    onChange={handleImageChange}
    id = "fileInput" style={{display:"none"}}></input>
    <div className= "col-md-3">
        <div className = "myshadow ProfileImage " style = {{width:160,maxWidth:160,height:277, justifyContent:"center" , marginBottom:"10px"}}
        onClick={()=>{
            document.getElementById("fileInput").click() ; 
        }} >
        <img  
        className="overlay"
        id = "previewImage" src ={props.ProfileImageAddress} alt = "Cover " style = {{maxWidth:160,height:277, maxHeight:"277"}}></img>
        </div>
        <div><button onClick={handleUploadImageButton} className="btn btn-info" style={{display:UploadImageButton , marginRight:"20px"}}>Upload</button>
        <button onClick={handleFinalUpload} className="btn btn-info" style={{display:UploadImageButton}}>Cancel</button>
        </div>
    </div>
</div>;

   
    return(
        <div  >


            <div>
              <div id="followsModel" className="modal fade" role="dialog">
                      <div className="modal-dialog" >
                        <div className="modal-content" >
                          <div className="">
                            {/* <button type="button" class="close" data-dismiss="modal" style={{outline:"none" ,color:"red" }}>&times;</button> */}
                            
                            <div className = "">
                              <ul className="nav nav-tabs nav-justified" style={{marginTop:"3px"}}>
                                <li className="active" ><a data-toggle="tab" href="#followsList" >Follows</a></li>
                                <li><a data-toggle="tab" href="#followersList">Followers</a></li>
                              </ul>
                            </div>
                          </div>
                          <div className="modal-body" style={{height:400 , maxHeight:400, overflowY:"auto"}}>

                            <div className="tab-content">
                                <div id = "followsList" className="tab-pane fade in active" >
                                              
                                              {props.follows.map(eachUser =>{
                                                console.log(eachUser)
                                            return (<div className="ProfileFollowsList">
                                              <p><a className= "handy" type="button"  onClick={()=>{ history.push({
                                          pathname:'/Profile' , 
                                          search:'?UserId='+ eachUser[0],
                                          state:{id: eachUser[0] , key:eachUser[0]}, 
                                          
                                      });}}  style={{ textDecoration:"none"}} data-dismiss="modal" >
                                      <img  src={eachUser[1]=="" ?process.env.PUBLIC_URL + "ScribbleBow.png": eachUser[1]}
                                      style={{ borderRadius:"50%" , width:"50px" , height:"50px" , border:"1px solid lightgray" , marginRight:"10px"}}
                                      ></img> 
                                      {eachUser[0]}
                                      </a></p>
                                            </div>)
                                          })}
                                          {props.follows.length==0 ? "No Follows Yet":null}
                                </div>
                                <div id = "followersList" className="tab-pane fade in " >
                                            {props.followers.map(eachUser =>{
                                              console.log(eachUser)
                                          return (<div className="ProfileFollowsList">
                                            <p><a className= "handy " type="button"  onClick={()=>{ history.push({
                                        pathname:'/Profile' , 
                                        search:'?UserId='+ eachUser[0],
                                        state:{id: eachUser[0] , key:eachUser[0]}, 
                                        
                                    });}} style={{ textDecoration:"none"}}  data-dismiss="modal" >
                                    <img  src={eachUser[1]===""? process.env.PUBLIC_URL + "ScribbleBow.png": eachUser[1]}
                                    style={{ borderRadius:"50%" , width:"50px" , height:"50px" ,border:"1px solid lightgray" , marginRight:"10px"}}
                                    ></img> 
                                    {eachUser[0]}
                                    </a></p>
                                          </div>)
                                      })}

                                      {props.followers.length==0 ? "No Followers Yet":null}
                                </div>
                            </div>
                            

                          </div>
                          <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                          </div>
                        </div>

                      </div>
                    </div>
            </div>
            {currentUser == allprops.id ? ChangeableProfileImage : ProfileImage}
            <div className= "col-12 col-md-9 myshadow Details">
            <p style={{fontSize:"40px"}}>{allprops.fname+" "+allprops.lname}</p>
            <h3><span className="label label-default" style={{backgroundColor: Atts.getHashClassName(allprops.title.length)}}>{allprops.title}</span></h3>
            <hr></hr>
            <div className= "col-md-6" style={{ wordWrap:"pre-wrap"}} >
                <p>Bio: {allprops.bio}</p>
                {allprops.website?<p>Website: <a href= {allprops.website}  target="_blank">{allprops.website}</a> </p>:null}
                <br></br>
                {allprops.audiobow?<audio controls style={{outline:"none"}} loop controlsList="nodownload">
                      <source  src= {allprops.audiobow} type="audio/mp3" ></source>
                  </audio>:null}
            </div>
            
            <div className="col-md-6" >

                <div  className="container-inner" style={{display:"flex",  backgroundColor:""  , justifyContent:"space-evenly"}}>
                    <a type="button" style={{textDecoration:"none" , textAlign:"center", margin:"10px" , marginRight:"30px"}}  data-toggle="modal" data-target="#followsModel" className="handy">
                      <h4>Follows</h4><div style={{fontSize:"35px"}}><Caption caption={followCount.follows} /></div>
                    </a>
                    <a style={{textDecoration:"none" , textAlign:"center", margin:"10px" , marginLeft:"30px",backgroundColor:""}} data-toggle="modal" data-target="#followsModel" className="handy">
                      <h4>Followers</h4><div style={{fontSize:"35px"}}><Caption caption={followCount.followers} /></div>
                    </a>
                </div>
                <div className = "" style={{backgroundColor:""  ,  justifyContent:"flex-end" ,  display:"flexbox" , paddingRight:0}}>
                  {currentUser == allprops.id ?EditProfile:FollowMessage}
                </div>
               

                    

            </div>
           
            
            </div>
            
            
            <Dialog fullScreen open={open} scroll={"body"}>
         <div className="myshadow2" style={{height:"150px",color:"white",backgroundColor:"#f5ba13"}} >
          <Toolbar>
           
            <Typography variant="h4" style={{ flex: 1}}>
              EDIT PROFILE
            </Typography>
            <Button size="large" style={{fontFamily:"'Josefin Sans', sans-serif", fontSize:"20px"}} autoFocus color="inherit" onClick={handleClose}>
              CLOSE
            </Button>
          </Toolbar>
        </div>
       
        
        <EditProfileComp user = {allprops}/>
        </Dialog>
        </div>
    ) ; 
}

export const UserWorks = function(props)
{
    
    const [title , setTitle] = useState("Story");
    function handleWork(event)
    {
        var title = event.target.name  ; 
        setTitle(title) ; 
    }
    function getcategoryButtons(eachButton , index)
    {
       var mystyle= {
        backgroundColor:Atts.categoryColors[eachButton] , 
        minWidth: eachButton==="Fanfiction" ? "80px" : "auto"
       } 
      
      return ( <button key={index} className = "btn " style={mystyle} name = {eachButton} onClick={handleWork}>{eachButton ==="Article"?"Blog/Article" :eachButton}</button>) ; 
    }
    return(
        <div>
            <div className = "container-inner buttonGroup  myscroller-notrack " style={{display:"flex",justifyContent:"" , color:"white" , overflowX:"auto" }} >
            {Atts.categoryAvailable.map(getcategoryButtons)}</div>
            <hr></hr>
            <CategoryAll category={title} setPlayAudio={props.setPlayAudio} key={title} UserId  = {props.UserId} />
        </div>
    ); 
}
export const Analytics = function(props)
{
    
    ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);
    
    const chartConfigs = {
      type: 'column2d',
      width: 600,
      height: 400,
      dataFormat: 'json',
      dataSource:  {
        chart: {
          caption: "Analytics of your content",
          subcaption: props.UserId,
          xaxisname: "Category",
          yaxisname: "no of published documents",
          numbersuffix: "",
          theme: "fusion"
        },
        data: [
          {
            label: "Stories",
            value:props.Details.stories,
            color: Atts.categoryColors['Story']
          },
          {
            label: "Poems",
            value: props.Details.poems,
            color: Atts.categoryColors['Poem']
          },
          {
            label: "Quotes",
            value: props.Details.quotes,
            color: Atts.categoryColors['Quote']
          },
          {
            label: "Articles",
            value: props.Details.articles,
            color: Atts.categoryColors['Article']
          },
          {
            label: "FanFiction",
            value: props.Details.fanfiction,
            color: Atts.categoryColors['Fanfiction']
          },
          {
            label: "Audio",
            value: props.Details.audio,
            color: Atts.categoryColors['Audio']
          },
         
          {
            label: "Scripts",
            value: props.Details.scripts,
            color: Atts.categoryColors['Script']
          }
        ]
      },
    };
    
        return  <ReactFC {...chartConfigs} />;
    
}



