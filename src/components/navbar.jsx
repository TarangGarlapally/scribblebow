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
      return <div>Loding Notifications...</div>
    }
    else if(this.state.stage ===1 ){
      return (<div>
          {this.state.Notifications.reverse().map((eachNotif , index)=>{
            return (
              <a className="container-inner fluid " style = {{wordWrap:"pre-wrap" , padding :"10px" , textDecoration :"none" }} key = {index} href = {eachNotif.action}>
                <div className= "notifs" >
                  <h4 style={{fontWeight:"bold" , color: Atts.getHashClassName(eachNotif.from.length) }}>@{eachNotif.from}</h4>
                  <p>{eachNotif.contentname}</p>
                </div>
                <hr style = {{margin:"0px"}}></hr>
              </a> 
            ) ; 
          })}
          {this.state.Notifications.length == 0 ? "No recent notifications" : null}
      </div>)
    }
  }
}
function Navbar(props)
{

    const [open,setOpen] = useState(false);
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

    <div className="container-fluid ">

       <a className="navbar-brand nav-btn pointer" onClick={()=>{history.push("/home")}} >HOME</a>
      
                
               

    <button className="navbar-toggle navbar-toggle-right" type="button" data-toggle="collapse" data-target="#Cnav" aria-controls="Cnav" aria-expanded="false" aria-label="Toggle navigation">
        <i className="fa fa-navicon" ></i>
       </button>
       
       <div className="collapse navbar-collapse" id="Cnav">
    
        {forhome}
      
     <ul className="nav navbar-nav navbar-right">
              <li><a className="nav-btn pointer" onClick={()=>{history.push("/my-shelf")}}>MY SHELF</a></li>
              <li><a className="dropdown-toggle" type="button" data-toggle="dropdown" href="#"><i className="fa fa-bell" aria-hidden="true"></i></a>
                  <ul className="dropdown-menu" >
                      <li ><a style={{fontWeight:"bold"}}>Recent Notifications</a></li>
                      <hr></hr>
                      <div className="container fluid myscroller-notrack" style = {{width:"400px" , height:"400px" , overflowY: "auto"}}>
                        <Notifications userName = {props.userName} history = {history}></Notifications>
                      </div>
                       
                  </ul>
              </li>

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
