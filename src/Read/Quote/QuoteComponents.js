import React, { useState, useEffect } from 'react' ; 
import * as icons from 'react-icons/md';
import {Caption, LoadingPage} from '../../components/Loading' ; 
import * as Atts from '../../Write/Story/Atts' ; 
import db from '../../database/db';
import * as firebase from 'firebase';
import { useHistory } from 'react-router';
import { sendTokenToServer } from '../../Notifications/client';
import { ScrollTo } from "react-scroll-to";

export default function Quote(props)
{
    
    var mytoken  = "caAhyh1M_fi2QJ2SjdvOMW:APA91bE4pECXVafTqbHn6nWIev2ObLPK7H_M6M_zQmVkhSutuVj3AAXDyWZ7uaz-86MdmpfRpRUaglw5Si4ELJjomqLtFzrngR5GKBx817Jnd9kfhg1K9rL3dD-Dm5mn7xjsUyyZbuca" ; 
    const  QuoteStatus = props.Details  ;  
    console.log(QuoteStatus , "Quote Status" ) ; 
    const history = useHistory() ; 
    const [myShelf  , setMyShelf] = useState(props.myshelf) ;
    const [LikeCommentCount , setLikeCommentCount] = useState(
        {
            "likes": QuoteStatus.nlikes , 
            "comments": QuoteStatus.ncomments,
        }
    );
    const [AllCommentsDisplay , setAllCommentsDisplay] = useState(props.AllCommentsDisplay ? true : false) ; 
    
    if(props.AllCommentsDisplay){
        console.log(props.AllCommentsDisplay , "all COmments display " ) ; 
        window.scrollTo(300  ,500) ; 
    }
    const [LikeState , setLikeState] = useState(props.preLiked) ; 
    const [ReportStory, setReportStory] = useState({
        message : "" , 
        button : true 
    }) ; 
    let SBImage = process.env.PUBLIC_URL + "ScribbleBow.png" ; 
     const ImageProps = 
    {
        LinearGrad :  "linear-gradient( rgba(0, 0, 0, "+ QuoteStatus.upContrast*(0.1)  + "), rgba(0, 0, 0, "+ QuoteStatus.downContrast*(0.1) +") ) ," , 
        imageUrl :  "url('" + (QuoteStatus.coverid == ""? SBImage : QuoteStatus.coverid)  + "')"
    }
    console.log(ImageProps , "Image Props ") ; 
    function handleMyShelf()
    {

        if(myShelf)
        {
            db.firestore().collection("myshelf").doc(localStorage.getItem('username')).update({
                [Atts.documentName[props.title]]: firebase.firestore.FieldValue.arrayRemove(props.QuoteId)
            });
        }
        else 
        {        
                db.firestore().collection("myshelf").doc(localStorage.getItem('username')).update({
                    [Atts.documentName[props.title]]: firebase.firestore.FieldValue.arrayUnion(props.QuoteId)
                });
            
        }

        setMyShelf(!myShelf) ; 
    }
    function handleCommentSubmit(event)
    {
        event.preventDefault(); 
        console.log("THe event triggerd "); 
        let theComment = event.target.QuoteComment.value ;
        if(theComment !== "")
        {
                let thePushComment = {"user": localStorage.getItem('username'), "comment" : theComment} ;
                console.log(thePushComment);
                    
                    db.firestore().collection("comments").doc(props.QuoteId).update({
                        comments: firebase.firestore.FieldValue.arrayUnion(thePushComment)
                    });
                
                
                db.firestore().collection(Atts.documentName[props.title]).doc(props.QuoteId).update(
                    {
                        "ncomments": QuoteStatus.ncomments+1 
                    }
                );
                //adding Notification to db 
                var CreatorsNotif = db.firestore().collection('notifications').doc(QuoteStatus.creator) ; 
                CreatorsNotif.get().then(qs =>{
                    if(qs.exists){
                        CreatorsNotif.update({
                            notiflist : firebase.firestore.FieldValue.arrayUnion({
                                from : localStorage.getItem('username') , 
                                action : window.location.href , 
                                contentname : "comment"
                            })  
                        }); 
                    }else {
                        CreatorsNotif.set({
                            notiflist : firebase.firestore.FieldValue.arrayUnion({
                                from : localStorage.getItem('username') , 
                                action : window.location.href , 
                                contentname : "comment"
                            }) , 
                            token :[]  
                        }); 
                    }
                })
               
                //added
                //sending notif to creator
                var notifBody = localStorage.getItem('username') + " Commented on your " + props.title ; 
                var notifTitle = "Comment" ; 
                db.firestore().collection('notifications').doc(QuoteStatus.creator).get().then(qs =>{
                    if (true || qs.data().token){
                        var tokens   =qs.data().token ; 
                        tokens.push(mytoken) ; 
                        sendTokenToServer(tokens,notifTitle,notifBody , window.location.href + "&AllCommentsDisplay="+window.pageYOffset ) ;
                    }
                }) ; 
                //notif sent
                setLikeCommentCount({
                    ...LikeCommentCount,
                    "comments": LikeCommentCount.comments+ 1 
                });
        }
         
    }
    function handleLikeButton()
    {
        
        let val = 1 ; 
        if(LikeState) val = -1 ;  
        
        db.firestore().collection(Atts.documentName[props.title])
        .doc(props.QuoteId)
        .update({
            "nlikes":  LikeCommentCount.likes+ val 
        }) ;
        
        if(LikeState)
        {
            db.firestore().collection("likes").doc(props.QuoteId).update({
                usernames: firebase.firestore.FieldValue.arrayRemove(localStorage.getItem('username'))
            });
            var CreatorsNotif = db.firestore().collection("notifications").doc(QuoteStatus.creator)  ; 
            CreatorsNotif.get().then(qs =>{
                if(qs.exists){
                    CreatorsNotif.update({
                        notiflist: firebase.firestore.FieldValue.arrayRemove({
                            from : localStorage.getItem('username') , 
                            action :window.location.href , 
                            contentname : "like" ,
                        }) 
                    });
                }
            })
            
        }
        else {
            
            db.firestore().collection("likes").doc(props.QuoteId).update({
                usernames: firebase.firestore.FieldValue.arrayUnion(localStorage.getItem('username'))
            });
            //Add Notification to the dataBase
            var CreatorsNotif = db.firestore().collection("notifications").doc(QuoteStatus.creator)  ; 
            CreatorsNotif.get().then(qs =>{
                if(qs.exists){
                    CreatorsNotif.update({
                        notiflist: firebase.firestore.FieldValue.arrayUnion({
                            from : localStorage.getItem('username') , 
                            action :window.location.href , 
                            contentname : "like" ,
                        }) 
                    });
                }
                else {
                    CreatorsNotif.set({
                        notiflist: firebase.firestore.FieldValue.arrayUnion({
                            from : localStorage.getItem('username') , 
                            action :window.location.href , 
                            contentname : "like" ,
                        }) , 
                        token : [] 
                    });
                }
            })
            
            //NotificationAdded
            //pushing Notification
            var title  = "Liked Your "+ props.title ; 
            var body  =  localStorage.getItem('username')+" liked your "+ props.title ; 
            var click_action = window.location.href ;  
            db.firestore().collection("notifications").doc(QuoteStatus.creator).get().then(qs=>{
                    if(qs.exists)
                    {
                        var tokens   =qs.data().token ; 
                        tokens.push(mytoken) ; 
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
    const EditQuote  =  <div className= "box"  onClick = {()=>{

        history.push({pathname:props.title==="Quote"?'/WriteQuote':'/recorder',
                        state: { id: props.QuoteId , title:props.title , new:false }, 
                        key:{ id: props.QuoteId , title:props.title , new:false }
                        }); 
        }} ><h3>Edit {props.title}</h3></div> ; 
    function handleReportStorySubmit(event)
    {
        
        event.preventDefault() ; 
        let temp = {
            cid: props.QuoteId  , 
            message: ReportStory.message
        }
    
        db.firestore().collection("content_reports").doc().set(temp) ; 

    }

    
    
    
        function PlayIt(){if(props.title==="Audio"){
            props.setPlayAudio(props.Details,props.QuoteId)
        }}
   

    return ( 
        <div>
            <div>
            <div id="DeleteModal" className="modal fade" role="dialog" style={{marginTop:"200px"}}>
                        <div className="modal-dialog" >
                            <div className="modal-content" >
                            <div className="modal-header">
                                <strong  style={{color:"red"}}>Delete {props.title}</strong>
                            </div>
                            <div className="modal-body" >
                                  <span>Do you Really Want to Delete the {props.title}  {props.title==="Quote"?<strong>"{QuoteStatus.QuoteContent.substring(1,10)}"...</strong>:<strong>{QuoteStatus.title}</strong>}</span>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal"b
                                onClick={()=>{
                                    db.firestore()
                                    .collection(Atts.documentName[props.title])
                                    .doc(props.QuoteId)
                                    .delete() ; 
                                    db.firestore().collection("likes").doc(props.QuoteId).delete() ; 
                                    db.firestore().collection("comments").doc(props.QuoteId).delete() ; 
                                    const storage = firebase.storage() ; 
                                    let tempdirect = props.title == "Quote"  ? "QuoteCoverPages/" : "CoverPages/" ; 
                                    storage.ref(tempdirect+ props.QuoteId).delete() ; 
                                    if(props.title == "Audio")
                                       storage.ref("AudioFiles/" +props.QuoteId ).delete() ; 
                                    db.firestore().collection('users').doc(QuoteStatus.creator).update(
                                        {
                                            "quotes":  firebase.firestore.FieldValue.increment(-1) 
                                        }
                                    )
                                    
                                    history.push({
                                    pathname: '/Profile',
                                    search: '?UserId=' + localStorage.getItem('username') , 
                                    state: { id: localStorage.getItem('username')},
                                })
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
                                  <strong  style={{color:"red"}}>Report {props.title} </strong>   {props.title==="Quote"?<div>"<strong>{QuoteStatus.QuoteContent.substring(1,10)}</strong>"</div>:null}
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
            <div className="container ReadQuoteArea" id="ReadQuote"   >
            {props.title==="Quote"?
           <div  style = {{backgroundColor:"", padding:"10px"  }}>
                    <div className="myshadow" > 
                        <div className="QuoteEditArea" id="QuoteEditArea"  style={{fontSize: QuoteStatus.fontSize ,  fontWeight:QuoteStatus.bold ? "bold": "" , color: QuoteStatus.fontColor , 
                        fontStyle:QuoteStatus.italic ? "italic": "" , 
                        filter: "brightness(" + QuoteStatus.brightness + "%)" , 
                        backgroundImage :ImageProps.LinearGrad + ImageProps.imageUrl }}  >
                            <p>{QuoteStatus.QuoteContent}</p>
                        </div>
                    </div>
            </div>
            :
           <div className="myshadow" style={{padding:"20px",position:"relative",height:"300px"}}>
           <img className="myshadow" src={QuoteStatus.coverid} alt="audio thumbnail" style={{position:"absolute",left:0,right:0,margin:"auto",height:"150px",width:"150px", borderRadius:"50%"}}/>
           <h4 align="center" style={{position:"absolute",left:0,right:0,margin:"auto",marginTop:"160px"}}>{QuoteStatus.title}</h4>
           <i className="fa fa-play pointer" onClick={PlayIt} style={{fontSize: "24px",color:"grey"}}></i>
           <p align="center" style={{position:"absolute",left:0,right:0,margin:"auto",marginTop:"180px",color:"grey"}}>{QuoteStatus.description}</p>
           <p className = "handy" align="center" style={{position:"absolute",left:0,right:0,margin:"auto",bottom:"20px"}} >{QuoteStatus.creator}</p>
           </div>
           }
           {props.title==="Quote"? <div className = "container-inner handy" style= {{display:"flex" , justifyContent:"flex-end"}} onClick={()=> history.push({
            pathname: '/Profile',
            search: '?UserId=' + QuoteStatus.creator,
            state: { id: QuoteStatus.creator },
        })}><h4>-{QuoteStatus.creator}</h4></div>:null}
            <hr></hr>
            <div className= ""  style = {{display: "flex", justifyContent:"space-evenly"}}>
                 <div className = "box"  style={{color: LikeState?"#E61D42":null }} onClick ={handleLikeButton}><icons.MdFavorite size = "40" /><Caption caption = {LikeCommentCount.likes} /> </div>
                 {localStorage.getItem('username') === QuoteStatus.creator ? EditQuote : null}
                 {localStorage.getItem('username') !== QuoteStatus.creator?<div className= "box" style={{color: myShelf ?"green":null}} onClick={handleMyShelf}> 
    {!myShelf?<icons.MdAdd  size="30"/>:<icons.MdCheck size="30"/>}<Caption caption={!myShelf?"Shelf":"Added"}/>
    </div>:null}
                 <div className= "box"   >{localStorage.getItem('username') === QuoteStatus.creator? <h3  style={{margin:"5px" , color:"red"}}  data-toggle="modal" data-target="#DeleteModal"  >Delete</h3>:<h3   data-toggle="modal" data-target="#ReportStoryModal">Report {props.title} </h3>}</div>
            </div>
            <div id ="Comment Section">
                <h3>Comments:</h3>
                <form onSubmit = {handleCommentSubmit}>
                <textarea
                            name="QuoteComment"
                            rows="1"
                            cols="65"
                            className="form-control myshadow rounded"
                            style={{resize:"none" , border: "none" , outline: "none",padding:"10px" }}
                            placeholder="Type Your Comment Here"
                />
                  <button className="btn btn-primary" name="comments" style = {{margin:"10px" , marginLeft:"0px"}}>
                        Comment
                    </button>
                </form>
                <a className= "handy" onClick = {()=>{ setAllCommentsDisplay(!AllCommentsDisplay)}}>All Comments ({LikeCommentCount.comments} ) </a>
                <div id= "AllComments" style={{ display : AllCommentsDisplay ? "": "none"}} >
                    <AllComments id = {props.QuoteId}  title = {props.title} ncomments  = {LikeCommentCount.comments} 
                    creator = {QuoteStatus.creator}
                    setCommentFunction = {setLikeCommentCount} nlikes = {LikeCommentCount.likes} key = {Math.random()} />
                </div>
                      
            </div>
        </div>
        </div>
    ) ; 
}

class AllComments  extends React.Component
{
    constructor(props)
    {
        super(props) ; 
        this.state  = {id:"" , stage : 0  , AllQuoteComments : [] , ReportComment:{cid:this.props.id , comment:"" , commenter:"" , message:""} , DeleteComment:{
            user: "" , 
            comment:""
        } , ReportButtonState:true} ; 
        this.handleReportSubmit = this.handleReportSubmit.bind(this);
    }
    shouldComponentUpdate(nextProps , nextState)
    {
        if(this.props == nextProps && this.state.id  == nextState.id 
            && this.state.stage  == nextState.stage && 
            this.state.ReportButtonState == nextState.ReportButtonState
            && this.state.ReportComment.cid == nextState.ReportComment.cid)return false  ; 
        else return true  ; 
    }
    GetAllComments = function (QuoteId)
    {
        
       
        db.firestore().collection("comments")
        .doc(QuoteId)
        .get()
        .then(querysnapshot =>{
            console.log("retriving comments")
            if(querysnapshot.exists)
                this.setState({AllQuoteComments :querysnapshot.data().comments , id:querysnapshot.id , stage: 4 } ); 
            else  this.setState({stage : 4 }) ; 
        }).catch(error =>{
            console.log(error , "no exits such comments") ; this.setState({stage : 4 }) ; 
        }) ; 

    }
    handleReportSubmit(event)
    {
        
        
        event.preventDefault() ;  
        let tempReport = {
            cid: this.props.id  ,  
            comment: this.state.ReportComment.comment  , 
            commenter: this.state.ReportComment.commenter, 
            message : this.state.ReportComment.message 
        } ; 
        db.firestore().collection("comment_reports").doc().set(tempReport) ; 

    }
    
    render()
    {
        this.GetAllComments(this.props.id); 
        if(this.state.stage== 0 )
        {
            return <h4>Loading Comments...</h4>
        }
        else if (this.state.stage  == 4 )
        {
            
            return(
                <div>

                    <div>
                            <div id="ReportCommentModal" className="modal fade" role="dialog" style={{marginTop:"50px"}}>
                                    <div className="modal-dialog" style={{position:""}} >
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
                                        <strong  style={{color:"red"}}>Delete Comment {this.props.category}</strong>
                                    </div>
                                    <div className="modal-body" >
                                           Do you really want to delete the Comment ?  
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-default" data-dismiss="modal"b
                                        onClick={()=>{
                                            db.firestore().collection("comments").doc(this.props.id).update({
                                                comments: firebase.firestore.FieldValue.arrayRemove(this.state.DeleteComment)
                                            }).then( qs =>{
                                                this.setState({stage:0}) ; 
                                            }) 
                                            db.firestore().collection(Atts.documentName[this.props.title]).doc(this.props.id).update({
                                                "ncomments" : this.props.ncomments -1 
                                                
                                            })
                                            db.firestore().collection('notifications').doc(this.props.creator).update({
                                                    notiflist : firebase.firestore.FieldValue.arrayRemove({
                                                        from : localStorage.getItem('username') , 
                                                        action : window.location.href , 
                                                        contentname : "comment"
                                                    })  
                                                }) ; 
                                            this.props.setCommentFunction(prevals =>{
                                                return {
                                                    ...prevals ,
                                                    comments : this.props.ncomments -1  

                                                }
                                            }) 
                                           

                                        }}   style={{width:"100px" , marign:"5px"}}>Yes</button>
                                        <button type="button" className="btn btn-default" data-dismiss="modal" style={{width:"100px" , marign:"5px"}}>No</button>
                                    </div>
                                    </div>

                                </div>
                                </div>
                    </div>
                    <div className="container-inner" style={{padding:"20px"}}>
                    {this.state.AllQuoteComments.map((eachComment , index)=>{
                        
                        return ( <div className="FitToContent Comment" key= {index} style={{ maxWidth:"500px" , wordWrap:"pre-wrap"}}>
                                    <h4 className="FitToContent" style={{color: Atts.getHashClassName(eachComment.user.length)}}>{eachComment.user}</h4>
                                    <p className = "" style={{ maxWidth:"500px" , wordWrap:"pre-wrap"}} >{eachComment.comment}</p>

                                    

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
                    {this.state.AllQuoteComments.length === 0 ? <h4>No Comments</h4>: null}
                    </div>
                </div>
               
            ); 
        }

    }
}