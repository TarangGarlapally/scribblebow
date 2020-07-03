import React from 'react';
import { Nav, Navbar, NavDropdown, Button, Form, FormControl } from 'react-bootstrap';
import { Redirect } from "react-router";
import { MdCreate } from 'react-icons/md';
import db from '../database/db' ;
function navbar(props)
{
    var currentLocation = window.location.pathname;
    var forhome = <ul className="nav navbar-nav ">
    <li><a href= "">CREATE</a></li>
    <li><a href = "">DISCOVER</a></li>
</ul> ; 
    return (<nav className="navbar  fixed-top navbar-expand-md" >

    <div className="container-fluid ">

       <a className="navbar-brand ">HOME</a>

    <button className="navbar-toggle navbar-toggle-right" type="button" data-toggle="collapse" data-target="#Cnav" aria-controls="Cnav" aria-expanded="false" aria-label="Toggle navigation">
        <i className="fa fa-navicon" ></i>
       </button>
       <div className="collapse navbar-collapse" id="Cnav">
    
        {currentLocation == "/home" ? forhome : null }
     <ul className="nav navbar-nav navbar-right">
              <li><a>MYSHELF</a></li>
              <li><a>NOTIFICATIONS</a></li>

            <li><a href="#" className="dropdown-toggle" type="button" data-toggle="dropdown"><span className="glyphicon glyphicon-user"></span><span class="caret"></span></a>
                  <ul class="dropdown-menu">
                  <li ><a style={{fontWeight:"bold"}}>{props.Username}</a></li>
                  <hr></hr>
                    <li><a href="profile.php">Profile</a></li>
                    <li><a href="profile.php#mylist">My list</a></li>
                    <li><a href="Settings.php">Settings</a></li>
                    <li><a href="#">Report</a></li>
                    <li><a type= "button" onClick={()=> db.auth().signOut()}>Logout</a></li>
                </ul>
          </li>
       </ul>
   </div>
   </div>
   </nav>) ; 
}
export default navbar ; 