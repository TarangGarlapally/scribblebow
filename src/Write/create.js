import React, { useState } from 'react';
import Header from '../components/NavHeader';
import CategoryDrafts from "./CreateComps";
import {  useHistory } from 'react-router';
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";
import sendNotif from "../Notifications/client" ; 




function Create(props) {

    
    const [stage, setStage] = useState(0);
    const [category, setCategory] = useState("works");
    const [ripple, setRipple] = useState();
    var history = useHistory();
    

    const categoryPathName = {
        "Story": "/WriteStory",
        "Poem": "/WriteStory",
        "Quote": "/WriteQuote",
        "Article": "/WriteStory",
        "fanfiction": "/WriteStory",
        "Audio": "/recorder",
        "Script": "/WriteStory"
    };

    function SelectButtons() {
        console.log("the buttons");
        return <div className=" container myscroller-notrack" style={{ display: "flex", overflowX: "auto", justifyContent: "" }} >
            <a className="btn create-btn" style={{ backgroundColor: "#E61D42", marginBottom: "10px", fontWeight: "bold" }} onClick={() => {setCategory("Story");  }}>Story</a>
            <a className="btn create-btn" style={{ backgroundColor: "#FF7F00", marginBottom: "10px", fontWeight: "bold" }} onClick={() => { setCategory("Poem") }}>Poem</a>
            <a className="btn create-btn" style={{ backgroundColor: "#FFED07", marginBottom: "10px", fontWeight: "bold" }} onClick={() => { setCategory("Quote") }}>Quote</a>
            <a className="btn create-btn" style={{ backgroundColor: "#74E03E", marginBottom: "10px", fontWeight: "bold" }} onClick={() => { setCategory("Article") }}>Blog/Article</a>
            <a className="btn create-btn" style={{ backgroundColor: "#0000FF", marginBottom: "10px", fontWeight: "bold" }} onClick={() => { setCategory("Fanfiction") }}>Fan-Fiction</a>
            <a className="btn create-btn" style={{ backgroundColor: "#2E2B5F", marginBottom: "10px", fontWeight: "bold" }} onClick={() => { setCategory("Audio") }}>Audio</a>
            <a className="btn create-btn" style={{ backgroundColor: "#8B00FF", marginBottom: "10px", fontWeight: "bold" }} onClick={() => { setCategory("Script") }}>Script</a>
        </div>;
    }

    {/* <div className = "container" style={{display:"flex",justifyContent:"space-evenly"}} ><a className = "btn btn-danger"  onClick={()=>{setStage(4)}}>Story</a> */ }


    return (
        <div>
            <Header title="Create" />
            <div className="container">
                <h4 className="font0" align="center" style={{ marginTop: "-20px" }}>Choose what to create...</h4>
            </div>
            <div className='container-fluid' style={{ marginTop: "-20px", marginBottom: "20px" }}>
            <SelectButtons />
            </div>
            <div className="container">
                
                <p style={{ fontSize: "30px", marginTop: "20px", marginBottom: "-20px", marginLeft: "5%", color: "#C5D9C3", float: "left" }}>Drafts</p>
                {category !== "works" ?

                    <Zoom in={true}>
                        <Fab className="newwork" style={{
                            float: "right", background: "#f5ba13",
                            color: "#fff",
                            border: "none",
                            borderRadius: "50%",
                            width: "36px",
                            height: "36px",
                            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
                            cursor: "pointer",
                            outline: "none",
                            fontSize: "36px", marginTop: "20px", marginBottom: "-20px", marginRight: "5%"
                        }} onClick={()=>{ if(category!=="works"){

                                 
                                history.push({pathname: categoryPathName[category], 
                                    state: { id: "" , title:category , new:true }, 
                                    key:{id: "" , title:category, new:true}
                                    });
                            
                            
                                    }}} >
                            <AddIcon style={{ fontSize: 24 }} />
                        </Fab>
                    </Zoom>
                    : null}
            </div>
            <div className="container">
                <hr style={{ width: "90%", borderTop: "2px solid #C5D9C3" }} />
               
            </div>
            <CategoryDrafts category={category} key={category} />

        </div>
    );



}
export default Create; 