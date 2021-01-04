import React, { useState } from 'react' ; 
import * as Atts from '../Story/Atts' ; 
import { Fab } from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import MySnackBar from "../../components/SnackBar";
import db from '../../database/db'; 
import * as UploadFile from '../../Storage/UploadFile' ; 
import { Redirect, useHistory } from "react-router";
import {LoadingPage} from '../../components/Loading';
import * as firebase from 'firebase';
export default function QuoteEditor(props)
{

    
    //all Component Variables----------------------------------------------------------------------------------
    let PubSaveButton = false  ; 
    let history = useHistory() ; 
    let QuotePreDetails  = props.Details  ; 
    let scribbleBow = "url(" +process.env.PUBLIC_URL+ "ScribbleBow.png"+ ")" ;
    let tempImage = "url('" +QuotePreDetails.coverid + "')" ;
    const UploadImage  =  <div>
                <input type="file" 
                name = "QuoteCoverPage" 
                onChange={handleImageChange}
                id = "fileInput" style={{display:"none"}}></input>
                <div className= "col-md-3">
                    <div  style = {{ justifyContent:"center" }}
                    onClick={()=>{
                        document.getElementById("fileInput").click() ; 
                    }} >
                    <img  
                    className="myshadow myimage"
                    id = "previewImage" src ={QuotePreDetails.coverid == "" ?process.env.PUBLIC_URL+ "ScribbleBow.png":QuotePreDetails.coverid  } alt = "Cover " style = {{ 
                        minWidth:160,maxWidth:160,maxHeight:160}}></img>
                    </div>
                </div>
            </div> ; 
    

    //end-Component Varibles----------------------------------------------------------------------------------
    //STATE VARIABLES 
    const [Image , setImage] = useState(null)  ; 
    const [openSnackbar , setSnackbar] = useState(false) ;  
    const [prePub , setPrePub] = useState(props.Details.published); 
    const [QuoteId , setQuoteId] = useState(props.QuoteId) ;
    const [stage , setStage] = useState(0) ;
    const [ImageProps , setImageprops] = useState(
        {
            imageUrl :   QuotePreDetails.coverid == "" ? scribbleBow: tempImage , 
            LinearGrad : "linear-gradient( rgba(0, 0, 0, "+ QuotePreDetails.upContrast*(0.1)  + "), rgba(0, 0, 0, "+ QuotePreDetails.downContrast*(0.1) +") ) ,"   , 
            UpSlider:QuotePreDetails.upContrast , 
            DownSlider:QuotePreDetails.downContrast
        }
    ) ; 

    const [QuoteStatus , setQuoteStatus] = useState(props.Details)
    console.log(ImageProps) ; 
    //END OF STATE VARIABLES 
    function handleQuoteStatus(event)
    {
        var {name,value} = event.target;
        switch(name)
        {
            case "QuoteContent" : let tempVal  = value  ;
                            console.log(tempVal.split('\n').length) ; 
                            console.log(tempVal.length);
                            if (tempVal.length > 735) value  = "" ;  
                            if(tempVal.split('\n').length-1 > 14) { value="" ;}   
        }
        setQuoteStatus(preprops =>{
            return {
                ...preprops , 
                [name]:value 
            }
        })

       
    }
    function handleImageChange(event)
    {
        var ImageFile =event.target.files[0] ;  
        if(event.target.files[0])
        {
            
            console.log(ImageFile.size[0]) ; 
            setImage(ImageFile) ;
            const reader = new FileReader() ; 
            reader.addEventListener("load" , function(){
                let CoverPageElement = document.getElementById("previewImage") ; 
                let QuoteEditArea = document.getElementById("QuoteEditArea") ; 

                CoverPageElement.setAttribute("src" , this.result) ; 
                setImageprops(preProps=>{
                    return {...preProps , imageUrl :"url(" + this.result+ ")" }
                }) ; 
                QuoteEditArea.style.backgroundImage = ImageProps.LinearGrad +  "url(" + this.result+ ")" ; 
                console.log(ImageProps.LinearGrad + " ,url(" + this.result+ ")" ) ; 
            }); 
            reader.readAsDataURL(ImageFile) ; 
         
        }
        
    }
    function handlePubSave(event)
    {
        let name  = event.target.name ; 

        if (name == "Publish")
        {
            PubSaveButton = true  ; 
        }
        else PubSaveButton = false  ; 
    }
    function handleQuoteSubmit(event)
    {
         event.preventDefault()   ; 
         //generating Quote Id 
         if(props.new)
            var QuoteId  = Date.now().toString() ; 
        else var QuoteId = props.QuoteId  ;
        
        setQuoteId(QuoteId) ; 
         if(Image != null)
            UploadFile.UploadImage("QuoteCoverPages/",  Image ,QuoteId , Atts.documentName[props.title]); 
        console.log(QuoteStatus); 
         let FinalAttributes = {
             creator : localStorage.getItem("username") , 
             quotecontent : QuoteStatus.QuoteContent,
             fontSize: QuoteStatus.fontSize , 
            fontStyle: QuoteStatus.fontStyle , 
            bold: QuoteStatus.bold,
            italic:QuoteStatus.italic, 
            fontColor: QuoteStatus.fontColor, 
            brightness:QuoteStatus.brightness,
             coverid  : QuoteStatus.coverid ,
             upContrast : ImageProps.UpSlider , 
             downContrast :ImageProps.DownSlider, 
             published: PubSaveButton , 
             ncomments :  QuoteStatus.ncomments  ,
             nlikes :QuoteStatus.nlikes , 
            
         } ; 

         console.log(FinalAttributes , "GOD") ; 

         if(props.new)
         {
            db.firestore().collection(Atts.documentName[props.title]).doc(QuoteId).set(FinalAttributes) ;
            db.firestore().collection('users').doc(FinalAttributes.creator).update({
                [Atts.documentName[props.title]] : firebase.firestore.FieldValue.increment(1)
            })

            if(!PubSaveButton)
            {
                
                    history.push(
                        {
                            pathname:'/WriteQuote', 
                            state:{
                                id: QuoteId, 
                                title: props.title, 
                                new: false , 
                            }
                        }
                    )
            }
         }
         else 
         {
            db.firestore().collection(Atts.documentName[props.title]).doc(QuoteId).update(FinalAttributes) ; 
         }

        
         if(!PubSaveButton)
            {
                setSnackbar(true) ;
            }
            else 
            {
                
                if (!prePub)
                {
                    db.firestore().collection("comments").doc(QuoteId).set({
                        comments: []
                    });
                    db.firestore().collection("likes").doc(QuoteId).set({
                        usernames: []
                    });
                    db.firestore().collection('users').doc(FinalAttributes.creator).update({
                        [Atts.documentName[props.title]] : firebase.firestore.FieldValue.increment(1)
                    });
                }
                setSnackbar(true) ; 
                setStage(5) ;
                setTimeout(()=>{setStage(4)},6000) ; 
                
            }

    }
    if(stage  ==  0 )
    {
        return (
            <div>
                <div className ="col-12 col-md-3"  style={{backgroundColor:"lightgray"}}>
                    
                <button className="btn btn-default" style={{margin:"5px "}} onClick = {handlePubSave} name = "Reset">Reset</button>
                <hr></hr>
                    <form onSubmit ={handleQuoteSubmit} >
                        <div style={{display:"flex" , justifyContent:"space-evenly"}}>
                        <button className="btn btn-warning" style={{margin:"5px "}} onClick = {handlePubSave} name = "Publish" >Publish</button>
                        <button className="btn btn-primary" style={{margin:"5px "}} onClick = {handlePubSave} name  = "Save">Save</button>
                        </div>
                        <h4>Quote</h4>
                        <textarea className="form-control" placeholder="Enter Your Quote Here" id= "QuoteContent"
                        rows="10"
                        name = "QuoteContent"
                        onChange = {handleQuoteStatus}
                        
                        style={{resize:"vertical"}}>
                        {QuotePreDetails.QuoteContent}
                        </textarea>
                        <h3>Image Settings</h3>
                        <h4>Brightness</h4>
                        <Slider
                            defaultValue={(props.Details.brightness-100)/10}
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            onChange={(event , val )=>{
                                setQuoteStatus(preprops=>{
                                    return {...preprops , 
                                    brightness : 100 + val*10}
                                })
                            }}
                            step={1}
                            marks
                            min={-5}
                            max={5}
                            
                        />
                        <h4>Contrast</h4>
                        <div>
                            <h5>Up</h5> 
                            <Slider 
                            defaultValue={QuotePreDetails.upContrast}
                            id = "UpContrast"
                            onChange={(event, val )=>{
                                    let QuoteEditArea = document.getElementById("QuoteEditArea") ; 
                                    let DownContrast = ImageProps.DownSlider ; 
                                    let theUpValue  = val  ; 
                                    if (theUpValue > 5)
                                        event.target.value  = 5  ; 
                                    if (theUpValue <= 0)
                                        event.target.value  = 0  ; 
                                        setImageprops( preprops =>{
                                        return { ...preprops , 
                                        LinearGrad: "linear-gradient( rgba(0, 0, 0, "+ theUpValue*(0.1)  + "), rgba(0, 0, 0, "+ DownContrast*(0.1) +") ) ," , 
                                        UpSlider: theUpValue
                                        }
                                    }
                                    ) ; 
                                    QuoteEditArea.style.backgroundImage = "linear-gradient( rgba(0, 0, 0, "+ theUpValue*(0.1)  + "), rgba(0, 0, 0, "+ DownContrast*(0.1) +") ) ," +  ImageProps.imageUrl ; 
                            }}
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={0}
                            max={5}
                            />
                            <h5>Down</h5> <Slider
                            defaultValue={QuotePreDetails.downContrast}
                            id = "DownContrast"
                            onChange={(event , val )=>{
                                    let QuoteEditArea = document.getElementById("QuoteEditArea") ; 
                                    let UpContrast = ImageProps.UpSlider ; 
                                    let theDownValue  = val  ; 
                                    if (theDownValue > 5)
                                        event.target.value  = 5  ; 
                                    if (theDownValue <= 0 )
                                        event.target.value  = 0  ;
                                    setImageprops( preprops =>{
                                        return { ...preprops , 
                                        LinearGrad:"linear-gradient( rgba(0, 0, 0, "+ UpContrast*(0.1)  + "), rgba(0, 0, 0, "+  theDownValue*(0.1) +") ) ," , 
                                        DownSlider :theDownValue
                                        }
                                    }
                                    ) ;  
                                    console.log(ImageProps)
                                    QuoteEditArea.style.backgroundImage = "linear-gradient( rgba(0, 0, 0, "+ UpContrast*(0.1)  + "), rgba(0, 0, 0, "+  theDownValue*(0.1) +") ) ," + ImageProps.imageUrl ; 
                            }}
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={0}
                            max={5}
                            
                        />
                        </div>
                        <div>
                        <h3>Font Settings</h3> 
                            <div className="handy" style={{display:"flex" , justifyContent:"space-around"}}>
                            <h4 onClick= {()=>{
                             setQuoteStatus(preprops=>{
                                 return({...preprops , bold: !QuoteStatus.bold})
                             })
                          }}   style={{ fontWeight:QuoteStatus.bold ? "bold": "" }} >B</h4>
                          <h4 onClick = {()=>{
                              setQuoteStatus(preprops=>{
                                 return({...preprops , italic: !QuoteStatus.italic})
                             })
                          }} style={{ fontStyle:QuoteStatus.italic ? "italic": ""  }}  >I</h4>
                            </div>
                            <h4>Size</h4>
                            <Slider onChange={(event , val)=>{
                                
                                setQuoteStatus(preprops =>{
                                    return {...preprops  , fontSize:val}
                                })
    
                            }} aria-labelledby="continuous-slider" />
                            <h4>Color</h4>
                            <div style={{ overflowX:"auto"}}>
                                {Atts.categoryAvailable.map((eachCat , index)=>{
                                    return ( <Fab key= {index} color="primary" size="small" style={{backgroundColor : Atts.categoryColors[eachCat] , margin:"5px"}} onClick ={()=>{
                                         setQuoteStatus(preprops =>{
                                             return {...preprops , 
                                             fontColor : Atts.categoryColors[eachCat]} 
                                         })
                                    }} />)
                                    
    
                                } )}
                                <Fab size="small" style={{backgroundColor :"white", margin:"5px"}} onClick ={()=>{
                                         setQuoteStatus(preprops =>{
                                             return {...preprops , 
                                             fontColor :"white"} 
                                         })
                                    }} />
                                <Fab size="small" style={{backgroundColor :"black", margin:"5px"}} onClick ={()=>{
                                        setQuoteStatus(preprops =>{
                                            return {...preprops , 
                                            fontColor :"black"} 
                                        })
                                }} />
                            </div>
                         
                        </div>
                        
                        <h4>UploadImage</h4>
                        {UploadImage}
                       
                       
                    </form>
                </div>
                <div className= "col-md-9 " style = {{backgroundColor:"", padding:"10px" , display:"flex" , justifyContent:"center"}}>
                    <div className="myshadow" > 
                        <div className="QuoteEditArea" id="QuoteEditArea"  style={{fontSize: QuoteStatus.fontSize ,  fontWeight:QuoteStatus.bold ? "bold": "" , color: QuoteStatus.fontColor , 
                        fontStyle:QuoteStatus.italic ? "italic": "" , 
                        filter: "brightness(" + QuoteStatus.brightness + "%)" , 
                        backgroundImage :ImageProps.LinearGrad + ImageProps.imageUrl }}  >
                            <p>{QuoteStatus.QuoteContent}</p>
                        </div>
                    </div>
                </div>
                <MySnackBar message= {!PubSaveButton ? "your "+props.title+" has been Saved" : "your "+props.title+ " has been Published"}
                                open = {openSnackbar}
                                key ={openSnackbar}
                            />
            </div>
        )
    }
    else if (stage == 4 ){
        
        return (<Redirect to={{
            pathname: '/ReadQuote',
            state: { id: QuoteId , title:props.title }, 
            search:"?QuoteId="+QuoteId+"&title="+props.title,
            key:{id: QuoteId , title:props.title}
        }} />) ;
        }
    else if(stage == 5)
    {
        return(<LoadingPage head={"no"} message={"Your"+props.title+ "is Getting Uploaded"}/>) ;
         
    }
   
}