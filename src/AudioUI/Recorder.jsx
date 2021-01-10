import React, { useState } from "react";
import Header from '../components/NavHeader';
import { UploadImage } from "../Storage/UploadFile";
import TextField from '@material-ui/core/TextField';
import db from "../database/db";
import * as Atts from '../Write/Story/Atts' ;
import {  Redirect } from "react-router";
import * as firebase from 'firebase';
import { LoadingPage } from "../components/Loading";

const audioType = 'audio/webm';

export default class Recorder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            recording: false,
            paused: false,
            isoldaudio:false,
            audioUrl: "",
            timer: 0,
            image:null,
            ctitle:"",
            cdescription:"",
            chashtags:"",
            coverid:"",
            id:this.props.location.state.id,
            publish:false,
            published:false,
            new: this.props.location.state.new
        };
       

        
        this.saveAudio = this.saveAudio.bind(this);
        this.handleUploadAudio = this.handleUploadAudio.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleChange = this.handleChange.bind(this);


    }

    async componentDidMount() {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream, { mimeType: audioType });
        this.chunks = [];

        this.mediaRecorder.ondataavailable = e => {
            if (e.data && e.data.size > 0) {
                this.chunks.push(e.data);
            }
        };
    }

    handlePauseResume(e) {
        e.preventDefault();
        if (this.state.recording) {
            if (this.state.paused === false) {
                this.mediaRecorder.pause();
                this.setState({ paused: true });
            }
            else {
                this.mediaRecorder.resume();
                this.setState({ paused: false });
            }
        }
    }

    startRecording(e) {
        e.preventDefault();
        if (!this.state.recording) {
            this.chunks = [];
            if (this.mediaRecorder) {
                this.mediaRecorder.start(10);

                this.setState({ audioUrl: "", isoldaudio:false, recording: true, paused: false, timer: 0 });
            }
            else {
                alert("Please allow us to access your microphone to record audio");
            }
        }

    }

    stopRecording(e) {
        if (this.state.recording) {
            e.preventDefault();
            this.mediaRecorder.stop();
            this.setState({ recording: false });
            this.saveAudio();
        }
    }

    saveAudio() {
        const blob = new Blob(this.chunks, { type: audioType });
        this.blob = blob;
        const audioUrl = window.URL.createObjectURL(blob);

        this.setState({ audioUrl: audioUrl });
    }

    deleteAudio(audioUrl) {
        const audio = this.state.audio.filter(a => a !== audioUrl);
        this.setState({ audio });
    }



    handleUploadAudio(e) {
        if(this.state.ctitle===""){
            alert("Title is mandatory");
        }
        else{
        var audioID="";
        if(this.state.id===""){
            audioID = Date.now().toString();
            
            this.setState({id:audioID});
            db.firestore().collection("audio").doc(audioID).set({
                creator: localStorage.getItem("username"),
                description: this.state.cdescription,
                hashtags: typeof this.state.chashtags === 'string' ?this.state.chashtags.split("#"):this.state.chashtags, 
                ncomments:0,
                nlikes:0,
                published: e.target.value==="SAVE"?false:true,
                title: this.state.ctitle,
                titlekeys: Atts.Subs(this.state.ctitle.toLowerCase()),
                transcript:""
            });
            e.preventDefault();



            UploadImage('AudioFiles/', this.blob, audioID, "audio", "audio");
       
            if(this.state.image != null)
            UploadImage("CoverPages/",  this.state.image, audioID, "audio","cover");
        }
        else{
            audioID = this.state.id;
            db.firestore().collection("audio").doc(this.state.id).update({
                creator: localStorage.getItem("username"),
                description: this.state.cdescription,
                hashtags:  typeof this.state.chashtags === 'string' ?this.state.chashtags.split("#"):this.state.chashtags, 
                ncomments:this.state.published?firebase.firestore.FieldValue.increment(0):0,
                nlikes:this.state.published?firebase.firestore.FieldValue.increment(0):0,
                published: e.target.value==="SAVE" && this.state.published===false?false:true,
                title: this.state.ctitle,
                titlekeys: Atts.Subs(this.state.ctitle),
                transcript:""
            });
            e.preventDefault();
            if(!this.state.isoldaudio)
            UploadImage('AudioFiles/', this.blob, this.state.id, "audio", "audio");
       
            if(this.state.image != null)
            UploadImage("CoverPages/",  this.state.image, this.state.id, "audio","cover");
        }


        
        
        if( e.target.value==="PUBLISH"){
            
            db.firestore().collection("comments").doc(audioID).set({
                comments: []
            });
            db.firestore().collection("likes").doc(audioID).set({
                usernames: []
            });
            db.firestore().collection("users").doc(localStorage.getItem("username")).update({
                "audio": firebase.firestore.FieldValue.increment(1)
            });
            this.setState({publish:true});
        }
        
    }
}


    handleImageChange(event)
    {
        var ImageFile =event.target.files[0] ;  
        if(event.target.files[0])
        {
            
            console.log(ImageFile.size[0]) ; 
            this.setState({image: ImageFile}) ;
            const reader = new FileReader() ; 
            reader.addEventListener("load" , function(){
                var CoverPageElement = document.getElementById("previewImage") ; 
               
                CoverPageElement.setAttribute("src" , this.result) ; 
            }); 
            reader.readAsDataURL(ImageFile) ; 
         
        }
        
    }



    handleChange(event) {
        const { name, value } = event.target;
        this.setState(prevData => {
            return {
                ...prevData,
                [name]: value,
            };
        });
       console.log(this.state.ctitle)
    }

    render() {



        
        if(!this.state.new){
            db.firestore().collection("audio").doc(this.state.id).get().then(snapshot => {
                this.setState({
                    new: true,
                    audioUrl:snapshot.data().audioUrl,
                    coverid:snapshot.data().coverid,
                    cdescription: snapshot.data().description,
                    chashtags: snapshot.data().hashtags.join("#"),
                    published: snapshot.data().published,
                    ctitle: snapshot.data().title,
                    isoldaudio: true,
                })
            });
            
        }
        const UploadImage = <div>
            <h4 style={{marginLeft:"20px"}}>Select Cover Image</h4>
            <input type="file"
                name="StoryCoverPage"
                onChange={this.handleImageChange}
                id="fileInput" style={{ display: "none" }}></input>
            <div className="col-md-3">
                <div className="myshadow myimage " style={{ width: 160, height: 160, borderRadius:"50%",justifyContent: "center" }}
                    onClick={() => {
                        document.getElementById("fileInput").click();
                    }} >
                    <img
                        className="overlay"
                        id="previewImage" src={this.state.coverid?this.state.coverid:process.env.PUBLIC_URL + '/ScribbleBow.png'} alt="Cover " style={{ width: 160,borderRadius:"50%", height: 160}}></img>
                </div>
            </div>
        </div>


        const recordstyleNoRec = { margin: "5px", borderRadius: "50%", width: "36px", height: "36px", backgroundColor: "red" }
        const recordstyleRec = { margin: "5px", borderRadius: "50%", opacity: 0.2, width: "36px", height: "36px", backgroundColor: "red" }

        const stopstyleRec = { margin: "5px", width: "36px", height: "36px", backgroundColor: "#2E2B5F" };
        const stopstyleNoRec = { margin: "5px", width: "36px", height: "36px", backgroundColor: "#2E2B5F", opacity: 0.2 };
        const playpauseRec = { margin: "5px", width: "36px", height: "36px", backgroundColor: "blue" };
        const playpauseNoRec = { margin: "5px", width: "36px", height: "36px", backgroundColor: "blue", opacity: 0.2 };
       
        
        if(this.state.publish){

            return <SaveAndRedirect />
        }
       
       if(this.state.new){
       return <div style={{ overflowY: "hidden",height: "100vh" }}>
       
            <Header title="Audio" />
            
            <div style={{ overflowY: "auto", height:"auto", position:"absolute",top:"35%", bottom:"20%"}}>
            <div className="container">
            <div className="col-md-6">
            {UploadImage}
            </div>
            <div className="col-md-3">
            <TextField 
            id="standard-basic" 
            required
            label="Title"  
            name="ctitle"
            fullWidth={true}
            onChange={this.handleChange}
            value={this.state.ctitle}
            inputProps={{ maxLength:77}}
            InputProps={{style: { fontSize: 16, fontFamily: "Josefin Sans, sans-serif" } }}
            InputLabelProps={{style: { fontSize: 16, fontFamily: "Josefin Sans, sans-serif" } }}
            multiline
            />
            <br />
            <br />
            <TextField
              id="standard-textarea"
              label="Description"
              name="cdescription"
              fullWidth={true}
              inputProps={{ maxLength:256}}
              onChange={this.handleChange}
              value={this.state.cdescription}
              InputProps={{style: { fontSize: 16, fontFamily: "Josefin Sans, sans-serif" } }}
              InputLabelProps={{style: { fontSize: 16, fontFamily: "Josefin Sans, sans-serif" } }}
              multiline
            />
            <br />
            </div>
            <div className="col-md-3">
            <TextField 
            id="standard-textarea" 
            label="#hashtags"  
            name="chashtags"
            fullWidth={true}
            inputProps={{ maxLength:256}}
            onChange={this.handleChange}
            value={this.state.chashtags}
            InputProps={{style: { fontSize: 16, fontFamily: "Josefin Sans, sans-serif" } }}
            InputLabelProps={{style: { fontSize: 16, fontFamily: "Josefin Sans, sans-serif" } }}
            multiline
            />
            </div>
            </div>
            
            
          {this.state.recording === true ? <div><p>Recording </p><Timer timer={this.state.timer} /></div> : null}
            </div>
            <div style={{ position: "absolute", width: "100%", bottom: "15%", display: "flex", flex: "wrap" }}>
                {this.state.audioUrl === "" ? null : <audio controls>
                    <source src={this.state.audioUrl} type="audio/webm" />
                </audio>}
                {this.state.audioUrl === "" ? null : <button className="btn btn-default mybtn" value="SAVE" style={{ borderRadius: "20px", width: "20%" }} onClick={e=>this.handleUploadAudio(e)} >SAVE</button>}
                {this.state.audioUrl === "" || this.state.published===true? null : <button className="btn btn-default mybtn" value="PUBLISH" style={{ borderRadius: "20px", width: "20%" }} onClick={e=>this.handleUploadAudio(e)}>PUBLISH</button>}
            </div>
            <div className="nocopy theme-color-bg myshadow" style={{ position: "absolute", width: "100%", height: "15%", bottom: 0 }}>
                <div style={{ display: "flex", flex: "wrap", justifyContent: "center", padding: "10px" }}>
                    <div className='myshadow pointer' onClick={e => this.startRecording(e)} style={this.state.recording ? recordstyleRec : recordstyleNoRec}></div>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    {this.state.paused ? <div className='myshadow pointer' onClick={e => this.handlePauseResume(e)} style={{ margin: "5px", width: "36px", height: "36px", backgroundColor: "blue", borderRadius: "50%" }}><i className="fa fa-play" style={{ marginTop: "8px", marginLeft: "11px", color: "white", fontSize: "20px" }}></i></div>
                        : <div className='myshadow pointer' onClick={e => this.handlePauseResume(e)} style={this.state.recording ? playpauseRec : playpauseNoRec}><i className="fa fa-pause" style={{ marginTop: "8px", marginLeft: "10px", color: "white", fontSize: "20px" }}></i></div>}

                    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <div className='myshadow pointer' onClick={e => this.stopRecording(e)} style={this.state.recording ? stopstyleRec : stopstyleNoRec}></div>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </div>
            </div>
        </div>
       }
       else{
        return <LoadingPage message={"Loading Your Draft"}/>
       }
    }
}

class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { time: this.props.timer }
    }

    updateTime = () => {
        this.setState(prevState => {
            return { time: prevState.time + 1 }
        });
    }
    render() {
        setInterval(this.updateTime, 1000);
        return <p>{Math.floor(this.state.time / 60) + ":" + this.state.time % 60}</p>
    }
}



function SaveAndRedirect(){
    const [flag,setFlag] = useState(0);
    setTimeout(()=>setFlag(2),4000);
    if(flag===0){
        return <LoadingPage message="Publishing your Audio"/>
    }
    else
    return <Redirect to="/home"/>
}