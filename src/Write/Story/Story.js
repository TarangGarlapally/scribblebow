import React, {useState, useContext } from "react";
import Header from '../../components/NavHeader' ; 
import * as Atts from './Atts' ;
import db from "../../database/db";
import * as StoryFuns from "../../database/StoryFuns";
import {AuthContext} from '../../Auth';
import * as UploadFile from '../../Storage/UploadFile' ; 
import { Redirect, useHistory } from "react-router";
import Loading from '../../components/Loading'; 
import StoryDetails from "../../Read/Story/Details";
import * as firebase from 'firebase';
import MySnackBar from "../../components/SnackBar";
import { sendTokenToServer } from "../../Notifications/client";

function WriteStory(props)
{

    console.log(props); 
    const [StoryStatus , setStoryStatus] = useState(props.StoryDetails) ; 
    console.log(StoryStatus); 
    const  [image , setImage] = useState(null) ;  
    const [stage , setStage] = useState(0) ;
    const [StoryId , setStoryId] = useState("") ; 
    const [openSnackbar , setSnackbar] = useState(false) ;
    const [snackMessage, setSnackMessage] = useState("");
    const [prePub , setPrePub] = useState(StoryStatus.published) ; 
    const [snackColor, setSnackColor] = useState("success");
  
    function handleImageChange(event)
    {
        var ImageFile =event.target.files[0] ;  
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
         
        }
        
    }
    console.log(image); 
    function handleShowHastags(value)
    {
        var ShowHashtagsElement = document.getElementById("ShowHashtags") ; 
        var myHashTags = value.split("#") ; 
        console.log(myHashTags)
        if(myHashTags.length >=10) {alert("no More Hashtags can be Added"); return;}
        ShowHashtagsElement.innerHTML = null ; 
        
        myHashTags.forEach((eachHash)=>{
            let span  = document.createElement("div"); 
            let h3 = document.createElement("h3"); 
            if(eachHash.length > 20) eachHash = eachHash.substr(0,20); 
            span.innerHTML = eachHash ; 
            span.className = "label label-default box" ; 
            
            span.style.backgroundColor = Atts.getHashClassName(eachHash.length) ; 
            h3.appendChild(span); 
            ShowHashtagsElement.appendChild(h3); 
        }); 
    }

    async function addCollab(uname){
        var uexists = false
        await db.firestore().collection("users").doc(uname).get().then((snapshot)=>{
            uexists = snapshot.exists;
        })
        if(uexists){
            db.firestore().collection(Atts.documentName[props.title]).doc(props.StoryDetails.id).update({
                collab: firebase.firestore.FieldValue.arrayUnion({username: uname, status: false})
            }).then((error)=>{
                if(error){
                    setSnackMessage("Invitation Failed");
                    setSnackColor("danger");
                    setSnackbar(true);
                    setTimeout(()=>{setSnackbar(false)},5000);
                }else{
                    if(props.StoryDetails.collab===""){
                        props.StoryDetails.collab = [{username: uname, status: false}];
                    }
                    else{
                        props.StoryDetails.collab.push({username: uname, status: false})
                    }
                    // //add notif to uname db
                    // db.firestore().collection('notifications').doc(uname).get().then(qs=>{
                    //     if(qs.exists){
                    //         db.firestore().collection('notifications').doc(uname).update({
                    //             notiflist: firebase.firestore.FieldValue.arrayUnion({
                    //                 from : localStorage.getItem('username') , 
                    //                 action : '/ReadStory?title='+ props.title + "&StoryId="+ props.StoryDetails.id, 
                    //                 contentname : "collab Invite" ,
                    //             }) 
                    //         })
                    //     }
                    //     else {
                    //         db.firestore().collection('notifications').doc(uname).set({
                    //             notiflist: firebase.firestore.FieldValue.arrayUnion({
                    //                 from : localStorage.getItem('username') , 
                    //                 action : '/ReadStory?title='+ props.title + "&StoryId="+ props.StoryDetails.id, 
                    //                 contentname : "collab Invite" ,
                    //             }) , 
                    //             token: [],
                    //         })
                    //     }
                    // })
                    // //notif added 

                    // //send notif to unama (redirect to read Story Page)
                    // var click_action  = "/ReadStory?title="+props.title + "&StoryId="+props.StoryDetails.id  ; 
                    // var title  = "Collab Invitation" ; 
                    // var body = props.StoryDetails.creator + " has invited you in collaborating his "+ props.title + "'"+ props.StoryDetails.StoryTitle+"'" ; 
                    // db.firestore().collection("notifications").doc(myStoryDetails.creator).get().then(qs=>{
                    //     console.log("send tokens to server" , qs.data().token) ; 
                    //     if(qs.exists){
                    //         var tokens   =qs.data().token ; 
                    //         tokens.push(mytoken) ; 
                    //         sendTokenToServer(tokens , title , body , click_action) ;
                    //     }
                    // }).catch(err =>{
                    //     console.log("Couldn't open the doc"); 
                    // }) ; 
                    // //notif sent

                    
                    setSnackMessage("Invited");
                    setSnackColor("success");
                    setSnackbar(true);
                    setTimeout(()=>{setSnackbar(false)},5000);
                }
            });
        }else{
            setSnackMessage("User doesn't exist.");
            setSnackColor("danger");
            setSnackbar(true);
            setTimeout(()=>{setSnackbar(false)},5000);
        }
    }



    function collabFormSubmit(event){
        event.preventDefault();
        const uname = event.target.username.value;
        if(uname === localStorage.getItem("username"))
        alert("You cannot add yourself as a collaborator.  -_-");
        else if(props.StoryDetails.collab !== ""){
            var index = -1;
            for(var i=0;i<props.StoryDetails.collab.length;i=i+1){
                if(props.StoryDetails.collab[i].username === uname){
                    index = i;
                    break
                }
            }
            if(index !== -1 && props.StoryDetails.collab[index].status === false){
                setSnackMessage("Already Invited");
                setSnackColor("danger");
                setSnackbar(true);
                setTimeout(()=>{setSnackbar(false)},5000);
            }
            else if(index !== -1 && props.StoryDetails.collab[index].status === true){
                setSnackMessage("Already a collaborator");
                setSnackColor("danger");
                setSnackbar(true);
                setTimeout(()=>{setSnackbar(false)},5000);
            }
            else{
                addCollab(uname);
            }
        }else{
            addCollab(uname);
        }

    }


    function delCollab(uname,status, index){
        
        db.firestore().collection(Atts.documentName[props.title]).doc(props.StoryDetails.id).update({
            collab: firebase.firestore.FieldValue.arrayRemove({username: uname, status: status})
        }).then((error)=>{
            if(error){
                setSnackMessage("Could not remove the collaborator!");
                setSnackColor("danger");
                setSnackbar(true);
                setTimeout(()=>{setSnackbar(false)},5000);
            }else{
                props.StoryDetails.collab.splice(index,0);
                if(props.StoryDetails.collab.length===0){
                    props.StoryDetails.collab = "";
                }
                
                setSnackMessage("Successfully removed the collaborator. Refresh to see changes.");
                setSnackColor("success");
                setSnackbar(true);
                setTimeout(()=>{setSnackbar(false)},5000);
                
            }
        })
    }


   function handleStoryStatus(event)
   {
        var {name,value} = event.target;
        var PubSave = true  ; 
        var tempGenre = StoryStatus.StoryGenre; 
        console.log(name, value); 
        if (document.getElementsByName("StoryContent").length > 0 ) PubSave = false ; else PubSave = true ;
        switch (name)
        {
            case "StoryFontSize" : if(parseInt(value) > 30)  value = "30"  ; break ; 
            case "StoryContent" : if(value.length > 0 ) PubSave = false ; else PubSave = true ; break ;
            case "StoryCoverPage": if(value) value=value[0] ; break ;    
            case "StoryHashtags" : handleShowHastags(value) ; break ; 
        } 
        setStoryStatus(prevValue =>{
            return {
                ...prevValue,
                [name] : value,
                ["PublishSave"] : PubSave 
            };
        });
   }
    function getGenres(eachGenre)
    {
        return (<option value={eachGenre} 
>{eachGenre}</option>); 

    }


    var TodayDate  =  new Date().toLocaleString()+","; 
    console.log(TodayDate); 
    var currLoc = window.location.pathname ;
    var UploadImage = null ;  
    var ArticleType = <div>
    <h4>Type</h4>
    <select className ={Atts.propsClass} name="ArticleType" onChange={handleStoryStatus}>
        <option>Personal Blog</option>
        <option>new/Science</option>
    </select></div> ; 
    var fanFiction = <div>
        <h4>Based On</h4>
        <input className = {Atts.propsClass} type="text" onChange={handleStoryStatus} name="FictionBasedOn"></input>
    </div>; 
    var PubSaveButton  = false ; 
    const history = useHistory();

    const {currentUser} = useContext(AuthContext);
    
    if (props.title != "Article")
    {
            
            UploadImage = <div>
            <h4>Select Cover Page</h4>
            <input type="file" 
            name = "StoryCoverPage" 
            onChange={handleImageChange}
            id = "fileInput" style={{display:"none"}}></input>
            <div className= "col-md-3">
                <div className = "myshadow myimage " style = {{width:160,maxWidth:160,height:277, justifyContent:"center" }}
                onClick={()=>{
                    document.getElementById("fileInput").click() ; 
                }} >
                <img  
                className="overlay"
                id = "previewImage" src ={props.StoryCoverPage} alt = "Cover " style = {{maxWidth:160,height:277, maxHeight:"277"}}></img>
                </div>
            </div>
        </div>
        ; 
        TodayDate = "" ; 
        ArticleType=null ; 
       
    }
    if(props.title !=="Fanfiction") fanFiction =null ; 

    function handleReset()
    {
        setStoryStatus(prevValue =>{
            return {
                ...prevValue,
                "StoryFont" : "", 
                "StoryFontSize":"20" ,
                "StoryTitle" : props.title+" Title" ,  
            };
        });

    }
    function getFontOptions(eachFont)
    {
        return (<option style={{fontFamily:eachFont}} value ={eachFont} >Story Font</option>) ; 
    }
    function handleSubButton(event)
    {
        var element  = event.target.name  ; 
        if(element === "Published") PubSaveButton = true  ; else PubSaveButton = false  ; 
    }
    function handleSubmit(event)
    {
        
        event.preventDefault() ;
        if(props.new)
            var StoryId  = Date.now().toString() ; 
        else var StoryId = props.StoryDetails.id  ; 
        console.log(StoryId +"my id0"); 
        let CoverId ="" ;  
        if(image != null)
            UploadFile.UploadImage("CoverPages/",  image ,StoryId , Atts.documentName[props.title]);
        var myStoryData = {
            "creator": StoryStatus.creator===""?localStorage.getItem("username"):StoryStatus.creator , 
            "title": StoryStatus.StoryTitle, 
            "content": StoryStatus.StoryContent, 
            "font":StoryStatus.StoryFont ,
            "genre": StoryStatus.StoryGenre , 
            "hashtags": typeof StoryStatus.StoryHashtags === 'string' ?StoryStatus.StoryHashtags.split("#"):StoryStatus.StoryHashtags, 
            "description":StoryStatus.StoryDescription , 
            "nlikes": StoryStatus.nlikes, 
            "ncomments":StoryStatus.ncomments  , 
            "published": PubSaveButton,
            "titlekeys": Atts.Subs(StoryStatus.StoryTitle),
            "coverid": CoverId
        } ; 
        if(props.title === "Article") myStoryData = {...myStoryData  , "type":StoryStatus.ArticleType} ; 
        if(props.title ==="Fanfiction") myStoryData ={...myStoryData ,"basedOn":StoryStatus.FictionBasedOn} ; 
        if (props.title === "Story"|"Poem"|"Fanfiction") myStoryData = {...myStoryData , "part": StoryStatus.part} ;      
        console.log(myStoryData)  ;
        db.firestore().collection(Atts.documentName[props.title]).doc(StoryId).get().then(qs=>{
            
        })
        if (props.new)
            {db.firestore().collection(Atts.documentName[props.title]).doc(StoryId).set(myStoryData) ;

               
                if(!PubSaveButton){
                    setSnackMessage(!PubSaveButton ? "your "+props.title+" has been Saved" : "your "+props.title+ " has been Published");
                    setSnackColor("success");
                    setSnackbar(true) ; 
                    
                    history.push(
                        {
                            pathname:'/WriteStory', 
                            state:{
                                id: StoryId, 
                                title: props.title, 
                                new: false , 
                            }
                        }
                    )
                }
                
            }
                
                
            
        else {db.firestore().collection(Atts.documentName[props.title]).doc(StoryId).update(myStoryData) ; }   
           
            setStoryId(StoryId); 
            if(!PubSaveButton)
            {
                setSnackMessage(!PubSaveButton ? "your "+props.title+" has been Saved" : "your "+props.title+ " has been Published");
                setSnackColor("success");
                setSnackbar(true) ; 
            }
            else 
            {
                
                if (!prePub)
                {
                    db.firestore().collection("comments").doc(StoryId).set({
                        comments: []
                    });
                    db.firestore().collection("likes").doc(StoryId).set({
                        usernames: []
                    });
                    let tempAtts  = Atts.documentName[props.title] ; 
                    db.firestore().collection('users').doc(myStoryData.creator).update({

                    [tempAtts] : firebase.firestore.FieldValue.increment(1)   
                }) ; 
                }
                setSnackMessage(!PubSaveButton ? "your "+props.title+" has been Saved" : "your "+props.title+ " has been Published");
                setSnackColor("success");
                setSnackbar(true) ; 
                setStage(5) ;
                setTimeout(()=>{setStage(4)},6000) ; 
                
            }
             
           
           
       
    } 

    function CollabTiles(myprops){
        if(props.StoryDetails.collab !== ""){
        return  props.StoryDetails.collab.map((collaborator,index)=>{
            if(collaborator.status===true){
                return <div>
                            <p className="col-12 col-sm-9">{collaborator.username}</p>
                            {props.StoryDetails.creator==localStorage.getItem("username")?<p className="col-12 col-sm-3 pointer" onClick = {()=>delCollab(collaborator.username,collaborator.status,index)}><i className="fas fa-times-circle" style={{color:"#bb2124"}}></i></p>:null}
                        </div>
            }else{
                return null;
            }
        });
    }else{
            return null;
                            
    }
    }

    function PendingCollabTiles(myprops){
        if(props.StoryDetails.collab !== ""){
        return  props.StoryDetails.collab.map((collaborator,index)=>{
            if(collaborator.status===false){
                return <div>
                            <p className="col-12 col-sm-9">{collaborator.username}</p>
                            {props.StoryDetails.creator==localStorage.getItem("username")?<p className="col-12 col-sm-3 pointer" onClick = {()=>delCollab(collaborator.username,collaborator.status,index)}><i className="fas fa-times-circle" style={{color:"#f0ad4e"}}></i></p>:null}
                        </div>
            }else{
                return null;
            }
        });
    }else{
            return null;
                            
    }
    }
    // var StoryTitles = StoryFuns.getStoryDetails(Atts.documentName[props.title]);   
    if(stage == 0 )
    {
        
        let SaveButton = (props.new || !StoryStatus.published); 
        return (
                    <div>
                        <Header title = {props.title.toUpperCase()} />
                        <form onSubmit = {handleSubmit}>
                        <div className= "col-12 col-md-3 myshadow StoryWriteProps" >
                                <div className = "container-inner" style={{display:"flex", justifyContent: "space-evenly"}} > <a class = "btn btn-default" onClick={handleReset} >Reset</a>
                                <button class = "btn btn-warning right" type="submit" value ="Publish" name = "Published" disabled= {StoryStatus.PublishSave} onClick = {handleSubButton}>Publish</button>
                                {SaveButton?<button class = "btn btn-primary right"  type = "submit" name = "Save"  disabled= {StoryStatus.PublishSave} onClick = {handleSubButton}>Save</button>:null}</div>
                            
                                <h4>Title</h4>
                                <input className = {Atts.propsClass} type="text" name = "StoryTitle" value={StoryStatus.StoryTitle} 
                                    onChange = {handleStoryStatus}
                                    
                                />
                                <h4>{props.title} Font</h4>
                                <select className = {Atts.propsClass} type="text" name = "StoryFont" onChange =  {handleStoryStatus}  value={StoryStatus.StoryFont}
                                > 
                                    {Atts.fontsAvailable.map(getFontOptions)}
                                </select>
                                <h4>{props.title} FontSize</h4>
                                <input className = {Atts.propsClass} type="text" name = "StoryFontSize" value={StoryStatus.StoryFontSize} 
                                    onChange =  {handleStoryStatus}  value={StoryStatus.StoryFontSize}
                                />
                                {ArticleType}
                                {fanFiction}
                                <h4>Description</h4>
                                <textarea className={Atts.propsClass}  type= "text"  name = "StoryDescription"
                                style={{height:"100px", resize:"none"}} onChange={handleStoryStatus}  value={StoryStatus.StoryDescription} ></textarea>
                                { props.title=="Story" ?<div> <h4>Genre</h4>
                                <select className = {Atts.propsClass} type="text" name = "StoryGenre" onChange =  {handleStoryStatus}  value={StoryStatus.StoryGenre}>
                                    {Atts.GenreAvailable.map(getGenres)}
                                </select></div> : null}
                                <h4>HashTags</h4>
                                <input className={Atts.propsClass} type="text" name="StoryHashtags" onChange={handleStoryStatus}  value={StoryStatus.StoryHashtags}></input>
                                <div className="myscroller" id="ShowHashtags" style={{width:"300px",maxWidth:"300px",height:"100px",maxHeight:"100px",
                                justifyContent:"wrap", overflowY:"auto"}}
                                ></div>

                                <h4>Part</h4><input className={Atts.propsClass} style={{width:"80px" }} type="number" onChange={handleStoryStatus} name="part"
                                 value={StoryStatus.part}></input>
                                {UploadImage}
                                <br />
                                
            
                        </div>
                        <div className= "col-12 col-md-7" >
                            <div className="myshadow"style={{ alignItem: "center" , padding:"100px" , paddingTop:"30px" , overflowX:"auto"}}>
                            <div className = "alert alert-success" style={{width:"595px" , textAlign:"center"}} name="StoryTitle">{StoryStatus.StoryTitle}</div>
                        
                            <textarea  className = "myshadow" name="StoryContent"
                            onChange= {handleStoryStatus}
                            style= {{resize:"none" , width:"595px", height:"842px", padding:"10px" ,
                            fontFamily: StoryStatus.StoryFont, 
                            fontSize:StoryStatus.StoryFontSize+"px", }} 
                            
                            placeholder= "Type Your Content Here,"
                            value={StoryStatus.StoryContent}>
                            

                            </textarea>
                            </div>
                            
                        </div>
                        <div className="col-12 col-md-2">
                        {props.StoryDetails.creator==localStorage.getItem("username")?<input type="button" className = "btn btn-default mybtn" data-toggle="modal" data-target="#CollabModal" value="Add a Collaborator"></input>:null}
                        <br />
                        <h4 style={{marginLeft:"10px"}}><b>Collaborators</b></h4>
                        {
                            <CollabTiles />
                        }
                        <br />
                        <br />
                        <br />
                        <h4 style={{marginLeft:"10px"}}><b>Pending</b></h4>
                        {
                            <PendingCollabTiles />
                        }
                        
                        </div>
                        </form>

                        <div id="CollabModal" className="modal fade" role="dialog" style={{marginTop:"50px"}}>
                                        <div className="modal-dialog"  >
                                            <div className="modal-content" >
                                            <div className="modal-header">
                                                <strong  style={{color:"black"}}>Add a Collaborator</strong>
                                            </div>
                                            <div className="modal-body" >
                                                        <div className="">
                                                                <p>A collaborator will be able to edit or delete your content. <i><b>"Choose your mate wisely."</b></i></p>
                                                                <p>Enter the username of the person you want to add as a collaborator.</p>
                                                                <form onSubmit={collabFormSubmit}>
                                                                    <input type="text" placeholder="Enter username" name="username"  required></input>
                                                                    <br /><button className="btn btn-sm btn-success" id="sendInvite" style={{marginTop:"2px"}}
                                                                    type="submit"
                                                                    >Invite</button>
                                                                </form>
                                                         </div>
                                            </div>
                                            <div className="modal-footer">
                                                
                                                <button type="button" className="btn btn-default" data-dismiss="modal" style={{width:"100px" , marign:"5px"}}>Close</button>
                                            </div>
                                            </div>

                                        </div>
                                </div>

                        <MySnackBar message= {snackMessage}
                            open = {openSnackbar}
                            key ={openSnackbar}
                            color = {snackColor}
                        />
                    </div>
                ) ; 
    } 
    else if (stage === 4 ){
        return (<Redirect to={{
            pathname: '/ReadStory',
            state: { id: StoryId , title:props.title }, 
            search:"?StoryId="+StoryId+"&title="+props.title,
            key:{id: StoryId , title:props.title}
        }} />) ;}
    else if(stage === 5)
    {
        return(<Loading message={"Your"+props.title+ "is Getting Uploaded"}/>) ;
         
    }

    
}

export default WriteStory ; 