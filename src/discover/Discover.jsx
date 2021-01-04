import React, { useState } from "react";
import Header from "../components/NavHeader";
import Slide from "@material-ui/core/Slide";
import { TopCreators, SearchResults, ContentArea } from "./DiscoverComps";
import { Redirect } from "react-router";






function Tab(myprops) {
    return <div className="draft-cont">
        <a style={{ textDecoration: "none", color: "black" }} >
            <div className="container-inner myshadow rounded" style={{ borderRadius: "2px", backgroundColor: "", padding: "20px", margin: "20px" }}>
                <div className="" style={{ width: "auto", backgroundColor: "" }}>
                    <img className="draft-image sm-cover" src="https://i.pinimg.com/originals/53/d4/ab/53d4ab97a2bf8a16a67950c52e34ca47.jpg" alt="Cover " style={{ padding: "10px" }}></img>
                    <div className="draft-title">

                        <h5>"Hello"<br />by<br />No one</h5>

                    </div>

                </div>

            </div>
        </a>
    </div>
}



function Rclicked(scrollclass) {

    document.getElementById(scrollclass).scrollLeft += 200;
}

function Lclicked(scrollclass) {

    document.getElementById(scrollclass).scrollLeft -= 200;
}










export default class Discover extends React.PureComponent {


    constructor(props) {
        super(props);
        var tag = new URLSearchParams(this.props.location.search).get("tag") ;
        this.state = { swipe: true,category:"", recid: 0, dir: "right", searchkey: tag?"#"+tag:"" };
    }



    CheckCat=()=>{
        if(this.state.category===""){
            if(this.state.searchkey==="")
            return <div className="container">
            <div className="col-md-10 discover-content myscroller-notrack" style={{ height: "60vh", overflowY: "scroll", paddingBottom: "200px", position: "relative" }}>
                <ContentArea cmsg="Stories Recommended For You" category="stories" type="recommended"/>
                <ContentArea cmsg="Latest Stories" category="stories" type="latest"/>
                <ContentArea cmsg="Poems Recommended For You" category="poems" type="recommended"/>
                <ContentArea cmsg="Latest Poems" category="poems" type="latest"/>
                <ContentArea cmsg="Articles Recommended For You" category="articles" type="recommended"/>
                <ContentArea cmsg="Latest Articles" category="articles" type="latest"/>
                <ContentArea cmsg="Fanfiction Recommended For You" category="fanfiction" type="recommended"/>
                <ContentArea cmsg="Latest Fanfiction" category="fanfiction" type="latest"/>
                <ContentArea cmsg="Quotes Recommended For You" category="quotes" type="recommended"/>
                <ContentArea cmsg="Latest Quotes" category="quotes" type="latest"/>
                <ContentArea cmsg="Audio Recommended For You" category="audio" setPlayAudio={this.props.setPlayAudio} type="recommended"/>
                <ContentArea cmsg="Latest Audio" category="audio" setPlayAudio={this.props.setPlayAudio} type="latest"/>

            </div>
            <div className="col-md-2 trending-creators" style={{ marginLeft: "20px", marginRight: "-20px" }}>
                <TopCreators />
            </div>
        </div>
        else{
            
            return <SearchResults setPlayAudio={this.props.setPlayAudio} searchkey={this.state.searchkey} />
        }
        }
        else{
            if(this.state.searchkey==="")
            return <div className="container">
            <div className="col-md-10 discover-content myscroller-notrack" style={{ height: "80vh", overflowY: "scroll", paddingBottom: "200px", position: "relative" }}>
                <ContentArea setPlayAudio={this.props.setPlayAudio} cmsg={this.state.category.charAt(0).toUpperCase() + this.state.category.slice(1)+" Recommended For You"} category={this.state.category}   type="recommended"/>
                <ContentArea setPlayAudio={this.props.setPlayAudio} cmsg={"Latest "+this.state.category.charAt(0).toUpperCase() + this.state.category.slice(1)} category={this.state.category} z type="latest"/>
               

            </div>
            <div className="col-md-2 trending-creators" style={{ marginLeft: "20px", marginRight: "-20px" }}>
                <TopCreators category={this.state.category} key={this.state.category}/>
            </div>
        </div>
            else
            return <SearchResults setPlayAudio={this.props.setPlayAudio} searchkey={this.state.searchkey} category={this.state.category} key={this.state.category}/>
        }
    }










    handleChange(event){
        this.setState({searchkey:event.target.value});
    }

    handleCat=(myprops)=>{
    this.setState({category:myprops})
    }
    ShowRecTabs = () => {
        const l = [0, 2, 4, 7, 8, 9, 6, 8];
        return l.map(Tab)
    }




    handleSearch = (event) => {
        event.preventDefault();
        const searchkey = event.target.searchinput.value.toLowerCase();
        this.setState({searchkey: searchkey,category:""});
        if(searchkey){
            console.log(searchkey);
        }
        
    }

    SelectButtons=()=>{
        console.log("the buttons");
        return <div className = " container myscroller-notrack" style={{display:"flex",overflowX:"auto",justifyContent:""}} >
        <a className = "btn create-btn" style={{backgroundColor: "#E61D42",marginBottom: "10px", fontWeight: "bold"}} onClick={()=>{this.handleCat("stories")}}>Stories</a>
        <a className = "btn create-btn" style={{backgroundColor: "#FF7F00",marginBottom: "10px",fontWeight: "bold"}} onClick={()=>{this.handleCat("poems")}}>Poems</a>
        <a className = "btn create-btn" style={{backgroundColor: "#FFED07",marginBottom: "10px",fontWeight: "bold"}} onClick={()=>{this.handleCat("quotes")}}>Quotes</a>
        <a className = "btn create-btn" style={{backgroundColor: "#74E03E",marginBottom: "10px",fontWeight: "bold"}} onClick={()=>{this.handleCat("articles")}}>Blogs/Articles</a>
        <a className = "btn create-btn" style={{backgroundColor: "#0000FF",marginBottom: "10px",fontWeight: "bold"}} onClick={()=>{this.handleCat("fanfiction")}}>Fan-Fiction</a>
        <a className = "btn create-btn" style={{backgroundColor: "#2E2B5F",marginBottom: "10px",fontWeight: "bold"}} onClick={()=>{this.handleCat("audio")}}>Audio</a>
        <a className = "btn create-btn" style={{backgroundColor: "#8B00FF",marginBottom: "10px",fontWeight: "bold"}} onClick={()=>{this.handleCat("scripts")}}>Scripts</a>
        </div>;
    }

    clicked = () => {
        this.state.dir === "left" ? this.setState({ dir: "right" }) : this.setState({ dir: "left" });
        this.setState({ swipe: !this.state.swipe });
        setTimeout(() => this.setState({ swipe2: !this.state.swipe2, dir: "right" }), 500);
    }
    render() {
        if(!localStorage.getItem("username") ){
            return <Redirect to={"/Log0"} />;
        }
        console.log("redering");
        
            return <div style={{ position: "fixed", width: "100%" }}>
                <Header title="Discover" />
                <div className='container-fluid' style={{ marginTop: "-20px", marginBottom: "20px" }}>
                    <div align="center" className="search-bar">
                        <form className="form-inline search-form" onSubmit={this.handleSearch}>
                            <div className="form-group search-input-group" >
                                <input className="form-control" style={{ width: "100vh" }} onChange={e=>this.handleChange(e)} type="text" name="searchinput" value={this.state.searchkey} placeholder="Search..." />
                            </div>
                            <button type="submit" name="submit" className="btn btn-warning mybtn search-submit" ><span className="glyphicon glyphicon-search"></span></button>

                        </form>
                    </div>
                    <this.SelectButtons />
                </div>
                {
                this.CheckCat()
                }


            </div>
            
    }

}
