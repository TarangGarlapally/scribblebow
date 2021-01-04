import React from 'react' ; 
var fontsAvailable = ["'Pacifico', cursive","Arial, Helvetica, sans-serif" ,"'Teko', sans-serif"]; 
var GenreAvailable = ["COMEDY" , "HORROR" , "ROMANCE" , "ACTION" ,"ADVENTURE","SCI-FI" ,"FAN_FICTION" ] ;
var categoryAvailable = ["Story","Poem" ,"Quote" , "Article" , "Fanfiction" , "Audio" ,"Script"];  
var GenreColors = {
    "COMEDY":"#f5ba13" , 
    "HORROR":"dark green" , 
    "ROMANCE":"#E61D42" , 
    "ACTION":"blue" ,
    "ADVENTURE":"green",
    "SCI-FI" :"silver" ,
    "FAN_FICTION":"purple"
} ; 
 var propsClass = "form-control " ; 
 var documentName  = {
     "Story":"stories", 
     "Poem": "poems" ,  
     "Article": "articles",
     "Audio":"audio", 
     "Script":"scripts", 
     "Fanfiction":"fanfiction",
     "Quote":"quotes"
 }
 var categoryColors = 
 {
    Story:"#E61D42", 
    Poem: "#FF7F00" , 
    Quote:"#FFED07", 
    Article: "#74E03E",
    Fanfiction:"#0000FF",
    Audio:"#2E2B5F", 
    Script:"#8B00FF", 
    
    
 }
 const categoryPathName = {
    "Story": "/WriteStory",
    "Poem": "/WriteStory",
    "Quote": "/WriteQuote",
    "Article": "/WriteStory",
    "fanfiction": "/WriteStory",
    "Audio": "/recorder",
    "Script": "/WriteStory"
};



 
 var defaultImageAddress = "https://i.pinimg.com/originals/53/d4/ab/53d4ab97a2bf8a16a67950c52e34ca47.jpg" ; 

 var tempComments = [
     {"user":"tarang" , "comment":"worst Story That I read in my Whole Life<br>"+
     "I Cannot even express How this Story is "+"<br>I finalyy SUggest You Gusys to Read this Story And Post Fucking Comments on it"},
     { "user":"karthik Pasupulatei","comment":"Guys,Please dont believe in any Comments"},
     { "user":"User 1213","comment":"Guys,Please dont believe in any Comments"},
     { "user":"User 3435","comment":"Guys,Please dont believe in any Comments"},
     { "user":"Uesrds 324er","comment":"not at all nice"},
     { "user":"Ufawer ","comment":"waste worst "},
     { "user":"Akdsfa dd","comment":"too Good "},
    
    ] ; 
var tempStoryContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate. Id faucibus nisl tincidunt eget nullam. Sed lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt. Pharetra diam sit amet nisl suscipit adipiscing bibendum est ultricies. Commodo nulla facilisi nullam vehicula ipsum a arcu cursus vitae. Neque viverra justo nec ultrices dui sapien.Odio facilisis mauris sit amet massa. Hendrerit dolor magna eget est lorem. Lacus laoreet non curabitur gravida arcu ac. Leo urna molestie at elementum eu. Egestas egestas fringilla phasellus faucibus scelerisque eleifend. Mauris pharetra et ultrices neque ornare aenean euismod elementum nisi. Sollicitudin ac orci phasellus egestas tellus. Enim facilisis gravida neque convallis a cras semper auctor. Urna id volutpat lacus laoreet non curabitur gravida arcu. Auctor eu augue ut lectus arcu bibendum at varius vel. Eget arcu dictum varius duis at consectetur lorem donec.  Aliquet nibh praesent tristique magna. At auctor urna nunc id cursus metus. Dolor purus non enim praesent.Sed cras ornare arcu dui vivamus arcu felis bibendum. Viverra tellus in hac habitasse platea dictumst vestibulum. Neque ornare aenean euismod elementum nisi quis eleifend. Nibh nisl condimentum id venenatis a condimentum. Interdum velit euismod in pellentesque massa placerat duis ultricies lacus. Suspendisse in est ante in nibh mauris cursus. Sodales ut eu sem integer vitae justo eget. Scelerisque viverra mauris in aliquam sem fringilla ut.  Est velit egestas dui id. Neque convallis a cras semper auctor neque vitae. Scelerisque felis imperdiet proin fermentum leo vel orci porta non. Amet justo donec enim diam vulputate. Id consectetur purus ut faucibus pulvinar elementum integer. Quam adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus. Risus nec feugiat in fermentum posuere. Ut faucibus pulvinar elementum integer enim neque volutpat ac tincidunt. Placerat vestibulum lectus mauris ultrices eros in cursus turpis. Elementum curabitur vitae nunc sed velit. Tristique magna sit amet purus gravida quis blandit turpis.  Cursus eget nunc scelerisque viverra mauris in aliquam sem. Fusce ut placerat orci nulla pellentesque dignissim enim sit amet. Convallis convallis tellus id interdum. Etiam tempor orci eu lobortis elementum nibh tellus molestie nunc. Faucibus purus in massa tempor nec feugiat nisl pretium fusce. Mauris a diam maecenas sed enim ut. Duis at consectetur lorem donec massa sapien faucibus. Sed augue lacus viverra vitae congue. Egestas pretium aenean pharetra magna ac placerat vestibulum lectus mauris. Sollicitudin tempor id eu nisl nunc mi. Bibendum est ultricies integer quis auctor elit sed vulputate. Commodo quis imperdiet massa tincidunt nunc. Lectus sit amet est placerat in egestas erat. Auctor augue mauris augue neque. Vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare. Risus in hendrerit gravida rutrum quisque non tellus orci ac. Consectetur adipiscing elit ut aliquam purus sit. Venenatis tellus in metus vulputate eu. Odio tempor orci dapibus ultrices in. Quam vulputate dignissim suspendisse in est.  Est placerat in egestas erat imperdiet. Gravida rutrum quisque non tellus orci ac auctor. Semper feugiat nibh sed pulvinar. Mauris rhoncus aenean vel elit scelerisque. Dictumst quisque sagittis purus sit amet. Amet dictum sit amet justo donec enim diam. Odio tempor orci dapibus ultrices in iaculis nunc sed augue. Tincidunt vitae semper quis lectus nulla at volutpat diam ut. Sed risus ultricies tristique nulla. Leo duis ut diam quam nulla porttitor massa id neque. Lorem ipsum dolor sit amet consectetur adipiscing elit ut. Magna sit amet purus gravida quis blandit turpis cursus.";
var tempUser  ={
    "bio": "I am an Idealist" , 
    "email": "karthik.pasupulatei@gmail.com", 
    "fname":"Karthik", 
    "gender":"male",
    "lname":"Pasupulatei",
    "title":"Film Maker",
    "imageAddress":"https://firebasestorage.googleapis.com/v0/b/scribblebow.appspot.com/o/CoverPages%2F1594155805012?alt=media&token=6ae6cc86-6256-46fa-8b4e-0b671384a4ef",
}

 function CoverPage(props)
{
    return (
        
            <div className= "col-md-3">
                <div class = "myshadow" style = {{width:160}}>
                <img src = {props.imageAddress} alt = "Cover " style = {{height:277}}></img>
                </div>
            </div>
        ); 
}
// Story:"#E61D42", 
// Poem: "#FF7F00" , 
// Quote:"#FFED07", 
// Article: "#74E03E",
// Fanfiction:"#0000FF",
// Audio:"#2E2B5F", 
// Script:"#8B00FF", 
function getHashClassName(length)
{
    length = length%7 ; 
    let color  ; 
    switch(length)
    {
        case 1 : color = categoryColors["Story"] ; break ; 
        case 2: color = categoryColors["Poem"] ;break ; 
        case 3 : color = categoryColors["Quote"] ;break ; 
        case 4 : color = categoryColors["Article"] ;break ; 
        case 5 : color = categoryColors["Fanfiction"] ;break ; 
        case 6 : color = categoryColors["Audio"] ;break ; 
        case 0 : color = categoryColors["Script"] ;break ; 
    }
    return color ; 
}

function Subs(ctitle) {
    var title = ctitle;
    title = title.split("");
    var l = title.length;
    var ss = [];
    for (var i = 0; i < l; i++) {
        var x = title[i];
        ss.push(x);
        for (var j = i + 1; j < l; j++) {

            x += title[j];
            ss.push(x);
        }

    }
    return ss;
}

 export {fontsAvailable ,categoryAvailable, 
    categoryPathName,
    propsClass, 
    CoverPage , 
    GenreAvailable , 
    GenreColors,categoryColors,
    documentName,Subs,
    defaultImageAddress, getHashClassName
    ,tempComments,tempStoryContent,tempUser} ; 