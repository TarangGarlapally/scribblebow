import React, { useState } from 'react';
import db from '../database/db' ;
import { Redirect, useHistory } from "react-router";
import Dialog from '@material-ui/core/Dialog';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import EditSettings from "../Write/Profile/EditSettings";
import { AttachFileSharp } from '@material-ui/icons';
import * as Atts from '../Write/Story/Atts' ; 
import SwipeableDrawer from '@material-ui/core/Drawer';
import {Img} from 'react-image';

class Notifications extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {stage:0 , Notifications: []  }
  }
  shouldComponentUpdate(nextProps, nextState){
    if(this.props.userName === nextProps.userName && 
      this.state.stage === nextState.stage && 
      this.state.Notifications.length === nextState.Notifications.length)return false ; else return true ; 
  }
  GetNotifications(){
    db.firestore().collection("notifications").doc(localStorage.getItem('username'))
            .get().then(qs =>{
              if(qs.exists){
                console.log("got the data" , qs.data())
                this.setState({stage:1, Notifications: qs.data().notiflist})
              }else {
                this.setState({stage:1})
              }
            }).catch(err => console.log(err)) ; 
  }
  render(){
    this.GetNotifications() ; 
    console.log(this.state.Notifications , "Notifications") ; 
    if(this.state.stage === 0){
      return <div className="font0" style={{textAlign:"center",marginTop:"20px"}}>Loding Notifications...</div>
    }
    else if(this.state.stage ===1 ){
      return (<div>
      <h4 className="font0" style={{paddingLeft:"20px"}}>Recent Notifications</h4>
          {this.state.Notifications.reverse().map((eachNotif , index)=>{
            if (eachNotif.from !== localStorage.getItem("username")){
              return (
                <a className="container-inner fluid nocopy font0" style = {{wordWrap:"pre-wrap" , textDecoration :"none" }} key = {index} href = {eachNotif.action}>
                  <div className= " notifs" style={{display: "flex", justifyContent: "space-between"}} >
                    <div style={{ height: "30px", width: "30px", borderRadius: "50%", marginRight: "10px", backgroundColor: "white" }}>
                      <Img className="pointer" alt="profile-pic small" style={{ height: "30px", width: "30px", borderRadius: "50%" }} src={["https://firebasestorage.googleapis.com/v0/b/scribblebow.appspot.com/o/ProfileImages%2F"+eachNotif.from+"?alt=media&token=b75480b9-dff3-400f-8009-04153790c3bb",'https://firebasestorage.googleapis.com/v0/b/scribblebow.appspot.com/o/ScribbleBow%2Fmyimage.png?alt=media&token=fcc7366e-7b03-4a96-aa82-922fd7fa426a']}/>
                    </div>

                  <div >
                  {eachNotif.contentname === "collab"?
                    <p><span style={{fontWeight:"bold" , color: Atts.getHashClassName(eachNotif.from.length) }}>{eachNotif.from}</span> has requested you to collaborate on their content</p>
                  :null}
                  {eachNotif.contentname === "comment"?
                    <p><span style={{fontWeight:"bold" , color: Atts.getHashClassName(eachNotif.from.length) }}>{eachNotif.from}</span> has {eachNotif.contentname+"ed"} on your content</p>
                    :null
                  }
                  {eachNotif.contentname === "like"?
                    <p><span style={{fontWeight:"bold" , color: Atts.getHashClassName(eachNotif.from.length) }}>{eachNotif.from}</span> has {eachNotif.contentname+"d"} your content</p>
                    :null
                  }
                  {eachNotif.contentname === "follow"?
                    <p><span style={{fontWeight:"bold" , color: Atts.getHashClassName(eachNotif.from.length) }}>{eachNotif.from}</span> started following you</p>
                    :null
                  }
                  </div>
                  </div>
                  <hr style = {{margin:"0px"}}></hr>
                </a> 
                
              );
            }else{
              return null;
            }
          })}
          {this.state.Notifications.length === 0 ? "No recent notifications" : null}
      </div>)
    }
  }
}
function Navbar(props)
{

    const [open,setOpen] = useState(false);
    const [notif,setNotif] = useState(false);
    var currentLocation = window.location.pathname;
    var history = useHistory() ; 

    function handleClose(){
        setOpen(false);
      
    }

    var forhome = <ul className="nav navbar-nav ">
    <li><a className="nav-btn pointer" onClick={()=>{history.push("/Create")}}>CREATE</a></li>
    <li><a className="nav-btn pointer" onClick={()=>{history.push("/discover")}}>DISCOVER</a></li>
        
</ul> ; 

    

    return (<nav className="navbar mynav fixed-top navbar-expand-md" id="navbar" style={{}}>
        <SwipeableDrawer anchor={"right"} open={notif} onClose={()=>{setNotif(false)}} onOpen={()=>{setNotif(true)}}>
            <div style={{padding:"10px",width:"50vh"}}>
            <Notifications userName = {props.userName} history = {history}/>
            </div>
            
        </SwipeableDrawer>
    <div className="container-fluid ">

       <a className="navbar-brand nav-btn pointer" onClick={()=>{history.push("/home")}} >HOME</a>
      
                
               

    <button className="navbar-toggle navbar-toggle-right" type="button" data-toggle="collapse" data-target="#Cnav" aria-controls="Cnav" aria-expanded="false" aria-label="Toggle navigation">
        <i className="fa fa-navicon" ></i>
       </button>
       
       <div className="collapse navbar-collapse" id="Cnav">
    
        {forhome}
      
     <ul className="nav navbar-nav navbar-right">
              <li><a className="nav-btn pointer" onClick={()=>{history.push("/my-shelf")}}>MY SHELF</a></li>
              <li><a className="nav-btn pointer" onClick={()=>{setNotif(true)}}><i className="fa fa-bell" aria-hidden="true"></i></a></li>
              {/* <li><a className="dropdown-toggle" type="button" data-toggle="dropdown" href="#"><i className="fa fa-bell" aria-hidden="true"></i></a>
                  <ul className="dropdown-menu" >
                      <li ><a style={{fontWeight:"bold"}}>Recent Notifications</a></li>
                      <hr></hr>
                      <div className="container fluid myscroller-notrack" style = {{width:"400px" , height:"400px" , overflowY: "auto"}}>
                        <Notifications userName = {props.userName} history = {history}></Notifications>
                      </div>
                       
                  </ul>
              </li> */}

            <li><a href="#" className="dropdown-toggle" type="button" data-toggle="dropdown"><span className="glyphicon glyphicon-user"></span><span className="caret"></span>
            </a>
                  <ul className="dropdown-menu">
                  <li ><a style={{fontWeight:"bold"}}>{props.Username}</a></li>
                  <hr></hr>
                    <li><a onClick={()=>{
                        history.push({
                            pathname:'/Profile' , 
                            search:"?UserId="+localStorage.getItem('username'),
                            state:{id: localStorage.getItem('username') ,  key:localStorage.getItem('username')},
                        })
                    }}>Profile</a></li>
                    <li><a className="pointer" onClick={()=> {setOpen(true)}}>Settings</a></li>
                    <li><a className="pointer" onClick={()=>{history.push("/Report")}}>Report</a></li>
                    <li><a href = "/" type= "button" onClick={()=> {localStorage.clear();db.auth().signOut()}}>Logout</a></li>
                </ul>
          </li>
       </ul>
   </div>
 
   <Dialog fullScreen open={open}   scroll={"body"}>
         <div className="myshadow2" style={{height:"150px",color:"white",backgroundColor:"#f5ba13"}} >
          <Toolbar>
           
            <Typography variant="h4" style={{ flex: 1}}>
              SETTINGS
            </Typography>
            <Button size="large" style={{fontFamily:"'Josefin Sans', sans-serif", fontSize:"20px"}} autoFocus color="inherit" onClick={handleClose}>
              CLOSE
            </Button>
          </Toolbar>
        </div>
       
        
        <EditSettings />
        </Dialog>

       
   </div>
   </nav>) ; 
}
export default Navbar ; 
