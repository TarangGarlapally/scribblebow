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

function WriteStory(props)
{

    console.log(props); 
    var [StoryStatus , setStoryStatus] = useState(props.StoryDetails) ; 
    console.log(StoryStatus); 
    var  [image , setImage] = useState(null) ; 
    var [stage , setStage] = useState(0) ;
    var [StoryId , setStoryId] = useState("") ;  
    
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
    if(props.title !="Fanfiction") fanFiction =null ; 

    function handleReset()
    {
        setStoryStatus(prevValue =>{
            return {
                ...prevValue,
                "StoryFont" : "", 
                "StoryFontSize":"20" ,
                "StoryTitle" : props.location.state.title+" Title" ,  
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
        if(element == "Published") PubSaveButton = true  ; else PubSaveButton = false  ; 
    }
    function handleSubmit(event)
    {
        
        event.preventDefault() ;
        if(props.new)
            var StoryId  = Date.now().toString() ; 
        else var StoryId = props.StoryDetails.id  ; 
        console.log(StoryId +"my id0"); 
        let CoverId = process.env.PUBLIC_URL +"ScribbleBow.png" ; 
        if(image != null)
            UploadFile.UploadImage("CoverPages/",  image ,StoryId , Atts.documentName[props.title]); 
        var myStoryData = {
            "creator": localStorage.getItem("username") , 
            "title": StoryStatus.StoryTitle, 
            "content": StoryStatus.StoryContent, 
            "font":StoryStatus.StoryFont ,
            "genre": StoryStatus.StoryGenre , 
            "hashtags": StoryStatus.StoryHashtags, 
            "description":StoryStatus.StoryDescription , 
            "nlikes": 0 , 
            "ncomments":0  , 
            "published": PubSaveButton,
            "titlekeys": Atts.Subs(StoryStatus.StoryTitle),
            "coverid": CoverId
        } ; 
        if(props.title == "Article") myStoryData = {...myStoryData  , "type":StoryStatus.ArticleType} ; 
        if(props.title =="Fanfiction") myStoryData ={...myStoryData ,"basedOn":StoryStatus.FictionBasedOn} ; 
        if (props.title == "Story"|"Poem"|"Fanfiction") myStoryData = {...myStoryData , "part": StoryStatus.part} ;      
        console.log(myStoryData)  ;
        if (props.new)
            {db.firestore().collection(Atts.documentName[props.title]).doc(StoryId).set(myStoryData) ;

                if(PubSaveButton)
                {
                    db.firestore().collection("comments").doc(StoryId).set({
                        comments: []
                    });
                    db.firestore().collection("likes").doc(StoryId).set({
                        usernames: []
                    }); } 
                else{
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
                alert("Your "+ props.title + " is Succesfully Saved."); 
            }
            else 
            {
                alert("Your "+ props.title + " is Succesfully Published."); 
                setStage(5) ;
                setTimeout(()=>{setStage(4)},6000) ; 
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
                                <h4>Genre</h4>
                                <select className = {Atts.propsClass} type="text" name = "StoryGenre" onChange =  {handleStoryStatus}  value={StoryStatus.StoryGenre}>
                                    {Atts.GenreAvailable.map(getGenres)}
                                </select>
                                <h4>HashTags</h4>
                                <input className={Atts.propsClass} type="text" name="StoryHashtags" onChange={handleStoryStatus}  value={StoryStatus.StoryHashtags}></input>
                                <div className="myscroller" id="ShowHashtags" style={{width:"300px",maxWidth:"300px",height:"100px",maxHeight:"100px",
                                justifyContent:"wrap", overflowY:"auto"}}
                                ></div>

                                <h4>Part</h4><input className={Atts.propsClass} style={{width:"80px" }} type="number" onChange={handleStoryStatus} name="part"
                                 value={StoryStatus.part}></input>
                                {UploadImage}
                                
                                
            
                        </div>
                        <div className= "col-12 col-md-9 " >
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
                        </form>
                    </div>
                ) ; 
    } 
    else if (stage == 4 ){
        return (<Redirect to={{
            pathname: '/ReadStory',
            state: { id: StoryId , title:props.title }, 
            search:"?StoryId="+StoryId+"&title="+props.title,
            key:{id: StoryId , title:props.title}
        }} />) ;}
    else if(stage == 5)
    {
        return(<Loading message={"Your"+props.title+ "is Getting Uploaded"}/>) ;
         
    }

    
}

export default WriteStory ; 