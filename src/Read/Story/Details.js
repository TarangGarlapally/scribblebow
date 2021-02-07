import React ,{useEffect, useState}from 'react' ; 
import * as icons from 'react-icons/md';
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";
import {Caption, LoadingPage} from '../../components/Loading' ; 
import * as Atts from '../../Write/Story/Atts'; 
import { Redirect, useHistory } from "react-router";
import db from '../../database/db';
import * as firebase from 'firebase';
import {sendTokenToServer} from '../../Notifications/client' ; 
function StoryDetails(props)
{
    
    var Details = "col-12 col-md-9  Details " ; 
    var shadow = "myshadow" ; 
    var currLoc = window.location.pathname;
    const myStoryDetails = {
        ...props.Details , 
    }
    const history = useHistory();
    const [invite,setInvite] = useState(false);
    const [isExpanded , setExpanded] = useState({
        comments:false  , 
        EditnDelete:false , 
    }) ; 
    const [CommentButton , setCommentButton] = useState("All Comments");
    var [LikeCommentCount , setLikeCommentCount] = useState(
        {
            "likes": myStoryDetails.nlikes , 
            "comments": myStoryDetails.ncomments,
        }
    );

    
    const [myShelf , setMyShelf] = useState(props.myShelf) ;
    const [ReportStory, setReportStory] = useState({
        message : "" , 
        button : true 
    }) ; 
    const [LikeState ,setLikeState] = useState(props.Liked) ; 
    console.log(LikeCommentCount , myShelf); 
    
    const [AllStoryComments , setAllComments] = useState([]) ;
    
    console.log("Storuy commets0"); 
    console.log(AllStoryComments); 
    var Hashtags = myStoryDetails.hastags ; 


    useEffect(()=>{
            try{
                if(myStoryDetails.collab === ""){
                    setInvite(false);
                }
                else{
                    myStoryDetails.collab.forEach(collaborator=>{
                        if(collaborator.username === localStorage.getItem("username") && collaborator.status===false){
                            
                            setInvite(true);
                        }
                        
                    });
                }
            }catch(err){
                setInvite(false);
            }
        
    },[myStoryDetails.collab]);

    function expand() {
        setExpanded(preExpand =>{
            return ({
                ...preExpand , 
                "comments": !isExpanded.comments
            })
        });
    }
    function expandEditnDelete()
    {
        setExpanded(preExpand =>{
            return ({
                ...preExpand , 
                "EditnDelete": !isExpanded.EditnDelete
            })
        });
    }
    function handleLikeButton()
    {
        
        let val = 1 ; 
        if(LikeState) val = -1 ;  
        
        db.firestore().collection(Atts.documentName[props.title])
        .doc(myStoryDetails.myid)
        .update({
            "nlikes":  LikeCommentCount.likes+ val 
        }) ;
        
        if(LikeState)
        {
            db.firestore().collection("likes").doc(myStoryDetails.myid).update({
                usernames: firebase.firestore.FieldValue.arrayRemove(localStorage.getItem('username'))
            });
            //Remove the Notification from the database
            db.firestore().collection("notifications").doc(myStoryDetails.creator).update({
                notiflist: firebase.firestore.FieldValue.arrayRemove({
                    from : localStorage.getItem('username') , 
                    action :window.location.href , 
                    contentname : "like" ,
                }) 
            });
            //removed
        }
        else {
            
            db.firestore().collection("likes").doc(myStoryDetails.myid).update({
                usernames: firebase.firestore.FieldValue.arrayUnion(localStorage.getItem('username'))
            });
           
            //Add Notification to the dataBase
            db.firestore().collection("notifications").doc(myStoryDetails.creator).update({
                notiflist: firebase.firestore.FieldValue.arrayUnion({
                    from : localStorage.getItem('username') , 
                    action :window.location.href , 
                    contentname : "like" ,
                })
            }).catch(err=>{
                console.log(err);
            });
            //NotificationAdded
            //pushing Notification
            var title  = "Liked Your Post" ; 
            var body  =  localStorage.getItem('username')+" liked your "+ props.title ; 
            var click_action = window.location.href ; 
            console.log(click_action , "click the  ") ;  
            db.firestore().collection("notifications").doc(myStoryDetails.creator).get().then(qs=>{
                console.log("send tokens to server" , qs.data().token) ; 
                if(qs.exists){
                    var tokens   =qs.data().token ;  
                    sendTokenToServer(tokens , title , body , click_action) ;
                }
            }).catch(err =>{
                console.log("Couldn't open the doc"); 
            }) ; 
            //end of Notification
        }
        
        setLikeCommentCount({
            ...LikeCommentCount,
            "likes": LikeCommentCount.likes+ val 
        }); 
        setLikeState(!LikeState) ;
        
    }

    //comment submission handling 
    function handleCommentSubmit(event)
    {
        event.preventDefault(); 
        console.log("THe event triggerd "); 
        let theComment = event.target.StoryComment.value ; 
        if(theComment != "")
        {
                    let thePushComment = {"user": localStorage.getItem('username'), "comment" : theComment} ;
                console.log(thePushComment);
                    
                if(AllStoryComments != null)
                {
                    db.firestore().collection("comments").doc(myStoryDetails.myid).update({
                        comments: firebase.firestore.FieldValue.arrayUnion(thePushComment)
                    });
                    
                    setAllComments([ thePushComment ,...AllStoryComments ]) ;
                    
                }
                else 
                {
                    db.firestore().collection("comments").doc(myStoryDetails.myid).set({
                        comments: firebase.firestore.FieldValue.arrayUnion(thePushComment)
                    });
                    setAllComments([thePushComment]) ;
                }
                console.log(LikeCommentCount.comments+1 , "ncomments Update") ; 
                db.firestore().collection(Atts.documentName[props.title]).doc(myStoryDetails.myid).update(
                    {
                        "ncomments": firebase.firestore.FieldValue.increment(1)  
                    }
                );
                //Add Notification to db 
                db.firestore().collection('notifications').doc(myStoryDetails.creator).update({
                    notiflist : firebase.firestore.FieldValue.arrayUnion({
                        from : localStorage.getItem('username') , 
                        action : window.location.href , 
                        contentname : "comment"
                    })  
                })
                //addes notif to db 
                //sending Notification to sever
                var notifBody = localStorage.getItem('username') + " Commented on your " + props.title ; 
                var notifTitle = "Comment" ; 
                db.firestore().collection('notifications').doc(myStoryDetails.creator).get().then(qs =>{
                    if (true || qs.data().token){
                        var tokens   =qs.data().token ; 
                        sendTokenToServer(tokens,notifTitle,notifBody , window.location.href ) ;
                    }
                })
                //notif sent
                setLikeCommentCount({
                    ...LikeCommentCount,
                    "comments": LikeCommentCount.comments+ 1 
                });
        }
         
        if(CommentButton == "Back to "+ props.title)
            handleStoryAllComment(); 
            
        setExpanded(preExpand =>{
            return ({
                ...preExpand , 
                "comments": !isExpanded.comments
            })
        });
    }
    function handleMyShelf()
    {

        if(myShelf)
        {
            db.firestore().collection("myshelf").doc(localStorage.getItem('username')).update({
                [Atts.documentName[props.title]]: firebase.firestore.FieldValue.arrayRemove(myStoryDetails.myid)
            });
        }
        else 
        {        
                db.firestore().collection("myshelf").doc(localStorage.getItem('username')).update({
                    [Atts.documentName[props.title]]: firebase.firestore.FieldValue.arrayUnion(myStoryDetails.myid)
                });
            
        }

        setMyShelf(!myShelf) ; 
    }


    function handleStoryAllComment()
    {   
        var StoryContentElement =  document.getElementById("StoryContent") ;
        var CommentSection  = document.getElementById("AllComments") ; 
        if(CommentButton== "All Comments")
        {
            StoryContentElement.style.display = "none" ; 
            CommentSection.style.display ="block" ; 
            setCommentButton("Back to "+ props.title ); 

        }
        else{
            StoryContentElement.style.display = "block" ; 
            CommentSection.style.display ="none" ; 
            setCommentButton("All Comments")
        }
        
    }
    function handleReportStorySubmit(event)
    {
        
        event.preventDefault() ; 
        let temp = {
            cid: myStoryDetails.myid  , 
            message: ReportStory.message
        }

        db.firestore().collection("content_reports").doc().set(temp) ; 

    }

    var firstprice = <h1 style={{color:"gold", }}><i class='fas fa-crown'></i></h1> ; 
    var LikeCommentAdd = <div id = "likeComment"className = "row container " style = {{width : 205 , backgroundColor:"" }}>
    <div className= "box" style = {{color: LikeState?"#E61D42":null}} onClick={handleLikeButton} >
    <icons.MdFavorite size="30" /><Caption caption={LikeCommentCount.likes}/></div>
    <div className= "box"  style = {{color: "blue"}}  onClick={expand} name="comments" > 
    <icons.MdComment  size="30" /><Caption caption={LikeCommentCount.comments}/></div>
    {localStorage.getItem('username') != myStoryDetails.creator?<div className= "box" style={{color: myShelf ?"green":null}} onClick={handleMyShelf}> 
    {!myShelf?<icons.MdAdd  size="30"/>:<icons.MdCheck size="30"/>}<Caption caption={!myShelf?"Shelf":"Added"}/>
    </div>:null}
</div>  ; 
    var creatorState = ()=>{
        try{
        if(myStoryDetails.collab === ""){
            return false;
        }else{
            var status = false;
            myStoryDetails.collab.forEach(collaborator=>{
                if(collaborator.username === localStorage.getItem("username") && collaborator.status===true){
                    status = true;
                }
                
            });
            return status;
            
        }
    }catch(err){
        return false;
    }
    }
    var EditStory =<div className="container-inner" style={{ display:"flex",justifyContent:"flex-end",  backgroundColor:"", padding:"10px"}}>
    {localStorage.getItem('username') === myStoryDetails.creator || creatorState()?<button className="btn btn-default" onClick={()=>{

        history.push({pathname:'/WriteStory', 
                        state: { id: myStoryDetails.myid , title:props.title , new:false }, 
                        key:{id: myStoryDetails.myid , title: props.title , new:false}
                        }); 
}} style={{margin:"5px"}}>Edit {props.title}</button>:null}
<button className="btn btn-default"   data-toggle="modal" data-target="#ReportStoryModal">Report {props.title} </button>
{localStorage.getItem('username') === myStoryDetails.creator? <button className="btn btn-danger" style={{margin:"5px"}}  data-toggle="modal" data-target="#DeleteModal"  >Delete</button>:null}
</div>  ; 

    var BasedOn = null; 
    var ArticleType = null;
    if ( myStoryDetails.type !=null) ArticleType = <p>Type: {myStoryDetails.type}</p> ;
    if(myStoryDetails.basedOn !=null ) BasedOn= <p>Based On: {myStoryDetails.basedOn}</p>
    if (myStoryDetails.basedon) BasedOn = <p>Based On: {myStoryDetails.basedon}</p> 
   if (currLoc !="/ReadStory"){ LikeCommentAdd =shadow= null ; } 
   if (myStoryDetails.published == false) LikeCommentAdd = null ; 
   var myHashtags = myStoryDetails.hashtags 
   console.log(myHashtags); 

    return (
        <div >
            <div>
                <div id="DeleteModal" className="modal fade" role="dialog" style={{marginTop:"200px"}}>
                        <div className="modal-dialog" >
                            <div className="modal-content" >
                            <div className="modal-header">
                                <strong  style={{color:"red"}}>Delete {props.title}</strong>
                            </div>
                            <div className="modal-body" >
                                    Do you Really Want to Delete the {props.title}  <strong>"{myStoryDetails.title}"</strong> 
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal"b
                                onClick={()=>{
                                    db.firestore()
                                    .collection(Atts.documentName[props.title])
                                    .doc(myStoryDetails.myid)
                                    .delete() ; 
                                    const storage = firebase.storage() ; 
                                    storage.ref("CoverPages/" + (myStoryDetails.myid)).delete() ; 
                                    db.firestore().collection("likes").doc(myStoryDetails.myid).delete() ; 
                                    db.firestore().collection("comments").doc(myStoryDetails.myid).delete() ; 
            
                                    db.firestore().collection('users').doc(myStoryDetails.creator).update(
                                        {
                                            [Atts.documentName[props.title]] : firebase.firestore.FieldValue.increment(-1)
                                        }
                                    ) ;
                                    
                                    history.push(
                                        {
                                            pathname:"/Profile" ,
                                            search: "?UserId=" + localStorage.getItem("username")  , 
                                            state : { id : localStorage.getItem("username")}

                                        }
                                         

                                    ) ; 
                                    
                                }}   style={{width:"100px" , marign:"5px"}}>Yes</button>
                                <button type="button" className="btn btn-default" data-dismiss="modal" style={{width:"100px" , marign:"5px"}}>No</button>
                            </div>
                            </div>

                        </div>
                        </div>

                        <div id="ReportStoryModal" className="modal fade" role="dialog" style={{marginTop:"50px"}}>
                            <div className="modal-dialog" >
                                <div className="modal-content" >
                                <div className="modal-header">
                                    <strong  style={{color:"red"}}>Report Story</strong>  "<strong>{myStoryDetails.title}</strong>" 
                                </div>
                                <div className="modal-body" >
                                            <div className="">
                                                    <form className="create-note container-inner" style={{boxShadow:"none"}} onSubmit={handleReportStorySubmit}>
                                                        <textarea rows="10" placeholder="Report Issue" name="message"  onChange={(event)=>{
                                                                let val = event.target.value;
                                                                console.log(!(val.length>=3)) ; 
                                                                setReportStory(preval =>{
                                                                    return {
                                                                        ...preval , 
                                                                        message: val , 
                                                                        button: val.length<3 
                                                                    }
                                                                }) ;
                                                               
                                                        }}></textarea>
                                                        <button className="btn btn-danger" style={{ display:"none" }} id="SubmitReportStory"
                                                        type="submit"
                                                        >Report</button>
                                                    </form>
                                                </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" data-dismiss="modal"
                                    onClick= {()=>{let SubmitReportButton = document.getElementById("SubmitReportStory") ;
                                        
                                        SubmitReportButton.click() ; }}    
                                    style={{ margin:"10px" , width:"200px"  }}  disabled= {ReportStory.button}>Report</button>
                                    <button type="button" className="btn btn-default" data-dismiss="modal" style={{width:"100px" , marign:"5px"}}>Close</button>
                                </div>
                                </div>

                                        </div>
                                </div>
            </div>
            <div className={Details} >
            <div className = {shadow} style={{padding:"15px"}} >
                {currLoc =="/home"|"/" ? firstprice : null}
                <p style = {{fontSize:40}}>{myStoryDetails.title}</p>
                <p  className="handy" onClick={()=>{
                        history.push({
                            pathname:"/Profile", 
                            search: "?UserId="+ myStoryDetails.creator, 

                        })
                }}>{myStoryDetails.creator}</p>
                <div className= "row container">
                    <a href ="#" ><span className="badge bg-white border box">{myStoryDetails.genre}</span></a>
                </div> 
                <hr />
                <p>Description: {myStoryDetails.description}</p>
                {BasedOn}
                {ArticleType}
                <p>Hashtags: </p>
                <div className = "row container">
                    { myHashtags ? myHashtags.map((eachHashtag )=>{
                        return(
                            <a  href={"/Discover?tag="+eachHashtag} style={{fontSize:20, padding:"10px", }}><span className ="label label-default box" style={{ backgroundColor:Atts.getHashClassName(eachHashtag.length)}}>{eachHashtag}</span></a>
                        ); 
                    }): null}
                </div>
                {LikeCommentAdd}
                <div name= "EditnDelete" className= "handy" onClick ={expandEditnDelete} style={{display : currLoc !="/ReadStory" ?"none":"flex" , justifyContent:"flex-end" }}
                ><img src={process.env.PUBLIC_URL +"3Dots.png"}  style={{ maxHeight:"40px" , maxWidth:"40px"}} ></img></div>
                
                

            </div>
            {isExpanded.comments && (<div className="container" style={{marginTop:"20px", }}>
                <form onSubmit={handleCommentSubmit}>
                   
                        <textarea
                            name="StoryComment"
                            rows="1"
                            cols="60"
                            className="myshadow rounded"
                            style={{resize:"none" , border: "none" , outline: "none",padding:"10px" }}
                            placeholder="Type Your Comment Here"
                        />
                    
                    <Zoom in={isExpanded.comments}>
                        <button className="btn btn-primary theCommentButton" name="comments" >
                        Comment
                        </button>
                    </Zoom>
                    <Zoom in={isExpanded.comments}>
                     <a className="btn btn-default theCommentButton" 
                     name="StoryAllComment"
                     onClick={handleStoryAllComment}>{CommentButton}</a>
                    </Zoom>
                    
                </form>
                
            </div>)}
            
            {isExpanded.EditnDelete&&(<Zoom in={isExpanded.EditnDelete}>
                    {EditStory}
                </Zoom>)}
            </div>
            <div id="AllComments" style={{display:"none"}} >
                            <Comments  id = {props.id}   
                            addedComments={AllStoryComments} 
                            creator={myStoryDetails.creator} 
                            title = {props.title}
                            setLikeCommentCount= {setLikeCommentCount}
                            />
                </div>
                
            {invite===true?
            <AcceptInvite details = {myStoryDetails} title={props.title} id={props.id} creator= {myStoryDetails.creator} />
            :null
            }
        </div>
    ); 
}

function AcceptInvite(props){

   
    function declineReq(){
        db.firestore().collection(Atts.documentName[props.title]).doc(props.id).update({
            collab: firebase.firestore.FieldValue.arrayRemove({username: localStorage.getItem("username"),status:false})
        }).then((err)=>{
            window.location.reload(false);
        });
        //collab rejected remove from the collabs notifs
        var click_action  = "/ReadStory?title="+props.title + "&StoryId="+props.id  ; 
        db.firestore().collection("notifications").doc(localStorage.getItem("username")).update({
            notiflist: firebase.firestore.FieldValue.arrayRemove({
                from : props.creator , 
                action :click_action , 
                contentname : "collab invite" ,
            }) 
        })
    }

    function acceptReq(){

        db.firestore().collection(Atts.documentName[props.title]).doc(props.id).update({
            collab: firebase.firestore.FieldValue.arrayRemove({username: localStorage.getItem("username"),status:false})
        }).then(err=>{
            db.firestore().collection(Atts.documentName[props.title]).doc(props.id).update({
                collab: firebase.firestore.FieldValue.arrayUnion({username: localStorage.getItem("username"),status:true})
            }).then(err=>{
                window.location.reload(false);
            });
        }) ; 

        //add notif to db (collab accepted)
        db.firestore().collection('notifications').doc(props.creator).get().then(qs=>{
            if(qs.exists){
                db.firestore().collection('notifications').doc(props.creator).update({
                    notiflist: firebase.firestore.FieldValue.arrayUnion({
                        from : localStorage.getItem('username') , 
                        action :"/ReadStory?title="+props.title + "&StoryId="+props.id, 
                        contentname : "collab accept" ,
                    }) 
                })
            }
            else {
                db.firestore().collection('notifications').doc(props.creator).set({
                    notiflist: firebase.firestore.FieldValue.arrayUnion({
                        from : localStorage.getItem('username') , 
                        action :"/ReadStory?title="+props.title + "&StoryId="+props.id , 
                        contentname : "collab accept" ,
                    }), 
                    token : []
                })
            }
        }).catch(err =>{ console.log("Unable to add to db")})
        //added notif to db

        //send notif to db 
        var title  = "Accepted your Invitation" ; 
        var body  =  localStorage.getItem('username')+" accepted your Invitation for "+ props.title; 
        var click_action = window.location.href ; 
        db.firestore().collection("notifications").doc(props.creator).get().then(qs=>{
            console.log("send tokens to server" , qs.data().token) ; 
            if(qs.exists){  
                var tokens   =qs.data().token ; 
                sendTokenToServer(tokens , title , body , click_action) ;
            }
        }).catch(err =>{
            console.log("Couldn't open the doc"); 
        }) ; 
        //notif sent
    }

    return <div className="col-12 myshadow" style={{position:"absolute",bottom:"20px",right:"40px",borderRadius:"4%",zIndex:"200",width:"300px",height:"200px",backgroundColor:"white"}}>
    <div className="col-12 " style={{padding:"5px",paddingTop:"35px",height:"150px",width:"300px",borderTopLeftRadius:"4%",borderTopRightRadius:"4%",textAlign:"center", backgroundColor:"white",borderBottom:"1px solid grey"}}>
        <h5><b><span style={{color:"green"}}>{props.details.creator}</span></b> invited you to collaborate on this {props.title}</h5>
    </div>
    <div className="col-12 " style={{height:"50px",width:"300px",borderBottomLeftRadius:"8%",borderBottomRightRadius:"8%" }}>
    <div className="col-12 col-md-6 pointer hov" onClick={acceptReq} style={{paddingTop:"10px",height:"50px",width:"150px",borderRight:"1px solid grey",textAlign:"center"}}>
    <h5 style={{color:"green"}}><b>Accept</b></h5>
    </div>
    <div className="col-12 col-md-6 pointer hov" onClick={declineReq} style={{paddingTop:"10px", height:"50px",width:"150px",borderRight:"1px solid grey",textAlign:"center"}}>
    <h5 style={{color:"red"}}><b>Decline</b></h5>
    </div>
    </div>
    </div>
}

function StoryContent(props)
{
    return (
        <div id = "StoryContent">
            <hr></hr>
            <div className = "StoryContent container"     >
       
       <p className = "nocopy" style={{ whiteSpace:"pre-wrap"}} >{props.Details.content}</p>
      
   </div>
        </div>
       
    ) ; 
}
function CoverPage(props)
{
    return (
        
            <div className= "col-md-3" style={{backgroundColor:""}}>
                <div className = "myshadow" style = {{width:160,maxWidth:160,height:277,justifyContent:"center" , marginBottom:"10px"}}>
                <img  src = {props.imageAddress} alt = "Cover " style = {{maxWidth:160,height:277, maxHeight:"277"}}></img>
                </div>
            </div>
        ); 
}

class Comments extends React.Component
{
    constructor(props)
    {
        super(props) ;
        this.state = { AllStoryComments:{ id:"" ,  comments:[]} , stage : 0 , ReportComment:{cid:this.props.id , comment:"" , commenter:"" , message:""} , DeleteComment:{
            user: "" , 
            comment:""
        } , ReportButtonState:true}

        this.handleReportSubmit = this.handleReportSubmit.bind(this) ; 
    }
    shouldComponentUpdate(nextProps , nextState)
    {
        if(this.props === nextProps 
            && this.state.AllStoryComments.id === nextState.AllStoryComments.id
            && this.state.ReportButtonState === nextState.ReportButtonState
            && this.state.stage === nextState.stage) 
            return false ; else return true  ; 

    }
    GetAllComments = function (StoryId)
    {
        
       
        db.firestore().collection("comments")
        .doc(StoryId)
        .get()
        .then(querysnapshot =>{
            if(querysnapshot.exists)
                this.setState({AllStoryComments :{ comments: querysnapshot.data().comments , id:querysnapshot.id} , stage: 4 } ); 
        }).catch(error =>{
            console.log(error) ;console.log("NO COmmetns"); 
        }) ; 

    }

    handleReportSubmit = function (event)
    {
        
        
        event.preventDefault() ; 
    
        let tempReport = {
            cid: this.state.AllStoryComments.id  ,  
            comment: this.state.ReportComment.comment  , 
            commenter: this.state.ReportComment.commenter, 
            message : this.state.ReportComment.message 
        } ; 
        db.firestore().collection("comment_reports").doc().set(tempReport) ; 

    }
   
        render()
        {
            this.GetAllComments(this.props.id); 
            let UpdatedComments = [...this.state.AllStoryComments.comments , ...this.props.addedComments] ; 
            console.log(UpdatedComments , "Updated Comments") ;
            this.setState({AllStoryComments:{comments:UpdatedComments , id:this.state.AllStoryComments.id}})
            if(this.state.stage == 4 )
            {
                return(
                    <div>

                        <div>
                                <div id="ReportCommentModal" className="modal fade" role="dialog" style={{marginTop:"50px"}}>
                                        <div className="modal-dialog"  >
                                            <div className="modal-content" >
                                            <div className="modal-header">
                                                <strong  style={{color:"red"}}>Report Comment</strong>
                                            </div>
                                            <div className="modal-body" >
                                                        <div className="">
                                                                <form className="create-note container-inner" style={{boxShadow:"none"}} onSubmit={this.handleReportSubmit}>
                                                                    <textarea rows="10" placeholder="Report Issue" name="message"  onChange={(event)=>{
                                                                          let val = event.target.value;
                                                                          console.log(!(val.length>=3)) ; 
                                                                         this.setState({ReportComment: {...this.state.ReportComment , message:val } , ReportButtonState: !(val.length>=3) } )
                                                                    }}></textarea>
                                                                    <button className="btn btn-danger" style={{ display:"none" }} id="SubmitReport"
                                                                    type="submit"
                                                                    >Report</button>
                                                                </form>
                                                         </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-danger" data-dismiss="modal"
                                             onClick= {()=>{let SubmitReportButton = document.getElementById("SubmitReport") ;
                                                    
                                                    SubmitReportButton.click() ; }}    
                                              style={{ margin:"10px" , width:"200px"  }}  disabled= {this.state.ReportButtonState}>Report</button>
                                                <button type="button" className="btn btn-default" data-dismiss="modal" style={{width:"100px" , marign:"5px"}}>Close</button>
                                            </div>
                                            </div>

                                        </div>
                                </div>

                                <div id="DeleteCommentModal" className="modal fade" role="dialog" style={{marginTop:"200px"}}>
                                    <div className="modal-dialog" >
                                        <div className="modal-content" >
                                        <div className="modal-header">
                                            <strong  style={{color:"red"}}>Delete Comment{this.props.category}</strong>
                                        </div>
                                        <div className="modal-body" >
                                               Do you really want to delete the Comment ?  
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-default" data-dismiss="modal"b
                                            onClick={()=>{
                                                db.firestore().collection("comments").doc(this.props.id).update({
                                                    comments: firebase.firestore.FieldValue.arrayRemove(this.state.DeleteComment)
                                                });
                                                db.firestore().collection('notifications').doc(this.props.creator).update({
                                                    notiflist : firebase.firestore.FieldValue.arrayRemove({
                                                        from : localStorage.getItem('username') , 
                                                        action : window.location.href , 
                                                        contentname : "comment"
                                                    })  
                                                }) ; 
                                                db.firestore().collection(Atts.documentName[this.props.title]).doc(this.props.id).update({
                                                    "ncomments" : this.state.AllStoryComments.comments.length -1 
                                                    
                                                }).then( qs =>{
                                                    this.props. setLikeCommentCount(preval =>{
                                                        return {  
                                                             ...preval,
                                                            "comments": preval.comments- 1 
                                                        
                                                        }
                                                    });
                                                        this.setState({stage:0}) ; 
                                                }) 
                                               

                                            }}   style={{width:"100px" , marign:"5px"}}>Yes</button>
                                            <button type="button" className="btn btn-default" data-dismiss="modal" style={{width:"100px" , marign:"5px"}}>No</button>
                                        </div>
                                        </div>

                                    </div>
                                    </div>
                        </div>
                        <div className="container">
                        <h1>All Comments</h1>
                        {this.state.AllStoryComments.comments.reverse().map((eachComment , index)=>{
                            
                            return ( <div className="FitToContent Comment" key= {index}>
                                        <h4 className="FitToContent" style={{color: Atts.getHashClassName(eachComment.user.length)}}>{eachComment.user}</h4>
                                        <p className = "FitToContent" >{eachComment.comment}</p>

                                        

                                        <div className= "dropdown">
                                            <a href="#" className="dropdown-toggle " style={{display:"flex" , justifyContent:"flex-end" , fontWeight:'bold' , textDecoration:"none"}}
                                            data-toggle="dropdown" aria-expanded="false" id="dropdownMenuLink">. . .</a>

                                                <ul className="dropdown-menu pull-right"  aria-labelledby="dropdownMenuLink" style={{marginLeft:"20px"}}>
                                                { eachComment.user != localStorage.getItem('username') || this.props.creator === localStorage.getItem('username') ?<li  class="dropdown-item" ><a className="handy" onClick={
                                                                ()=>{
                                                                    this.setState({ReportComment:{...this.state.ReportComment , "comment": eachComment.comment , "commenter": eachComment.user}}); 
                                                                }
                                                            }  data-toggle="modal" data-target="#ReportCommentModal"  >Report Comment</a></li>:null}

                                                            { eachComment.user === localStorage.getItem('username') || this.props.creator === localStorage.getItem('username') ? <li  class="dropdown-item" ><a className= "handy" style={{color:"red"}} 
                                                            onClick={()=>{
                                                                this.setState({DeleteComment:eachComment}) ; 
                                                            }}
                                                            data-toggle="modal" data-target="#DeleteCommentModal"
                                                            >Delete</a></li>: null}
                                                            
                                                </ul>
                                        </div>
                                        
                                        </div>) 
                                        
                                                   
                        })}
                        {this.state.AllStoryComments.comments.length === 0 ? <h4>No Comments</h4>: null}
                        </div>
                    </div>
                   
                ); 
            }
            else return (<img src= {process.env.PUBLIC_URL +"ripple-nobg.gif"}></img>)
           
        }
}

export default StoryDetails; 
export {StoryContent , StoryDetails , CoverPage , Comments}; 









// function handleStoryAllComment()
// {   
//     var StoryContentElement =  document.getElementById("StoryContent") ;
//     StoryContentElement.innerHTML = null ;
//     if(CommentButton== "All Comments")
//     {
//         let h1 = document.createElement("h1") ; h1.innerHTML ="All Comments" ; 
//         StoryContentElement.appendChild(h1); 
//         let AllComments = AllStoryComments ;  
//         if(AllComments != null)
//         {
//             AllComments.forEach((eachComment)=>{
//                 let div = document.createElement("div") ; 
//                 let h4 = document.createElement("h4") ; h4.innerHTML = eachComment.user ; 
//                 let p= document.createElement("p") ;  p.innerHTML = eachComment.comment ;
//                 let p1 =  document.createElement("h4") ; p1.innerHTML = "..." ;

//                 //Menu bar 
//                 let menuDiv = document.createElement("div") ; 
//                 let ReportComment  = document.createElement("a") ; 
//                 menuDiv.appendChild(ReportComment) ; 
//                 p1.addEventListener("click" , )
//                 h4.className  =  "FitToContent " ; 
//                 p.className = "FitToContent"; 
//                 h4.style.color = Atts.getHashClassName(eachComment.user.length);
//                 div.appendChild(h4) ; div.appendChild(p) ; div.appendChild(subDiv) ; 
//                 div.className = "Comment  FitToContent";
                                
                
//                 StoryContentElement.appendChild(div) ;
//         }); 
//         }
//         else{
//             let h3 = document.createElement("h3") ; 
//             h3.innerHTML = "No Comments" ; 
//             StoryContentElement.appendChild(h3) ;
//         }
        
//         setCommentButton("Back to Read "+ props.title ); 
//     }
//     else{

    
//         StoryContentElement.innerHTML =  myStoryDetails.content ; 
//         setCommentButton("All Comments")
//     }
    
// }


