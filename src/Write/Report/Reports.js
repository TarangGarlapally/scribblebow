import React from 'react' ; 
import Header from '../../components/NavHeader';
import SnackbarProvider from 'react-simple-snackbar'
import SnackBar from '../../components/SnackBar'; 
import db from '../../database/db' ; 
function Reports()
{
    
    function handleReportSubmit(event){
        event.preventDefault();
        var Issue  = event.target.Issue.value; 
        var Title = event.target.title.value;
        var reportIssue  = {
            email : localStorage.getItem('email'),
            content: { 
                title : Title,
                issue : Issue
            }
        }
        var reportId  = Date.now().toString() ;
        db.firestore()
        .collection('reports')
        .doc(reportId)
        .set(reportIssue) ; 

        event.target.Issue.value  = "" ; 
        event.target.title.value = "" ;

    }
    return(
        <div>
            <Header title="Report" />
            <div className="container" style={{display:"flex" , justifyContent:"center"}}>
                <div className=" " style={{position:""}}>
                    <form className="create-note" onSubmit={handleReportSubmit}>
                        <input  name = "title" placeholder="Title" style={{borderBottom:"0" , borderBottomColor:"white"}}></input>
                        <textarea name = "Issue" rows="10" placeholder="Report Issue"></textarea>
                        <button type = "submit" className="btn btn-danger" style={{ position:"relative", margin:"10px" , width:"200px"}}
                        >Report</button>
                    </form>
                </div>
                
            </div>
        </div>
    )
}

export default Reports ; 