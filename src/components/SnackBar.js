import React from 'react'
import { useSnackbar } from 'react-simple-snackbar'
import * as Atts from "../Write/Story/Atts"  ; 
import Slide from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { SnackbarContent } from '@material-ui/core'; 
import { render } from 'react-dom';
export default class MySnackBar extends React.Component {

  constructor(props)
  {
    super(props) ; 
    this.state = {open : this.props.open }
  }

  shouldComponentUpdate(nextProps , nextState)
  {
     if( this.props.open === nextProps.open 
      && this.state.open === nextState.open
      ) return false ; else return true  ; 
  }

  handleClose = ()=>{
    this.setState({open : !this.state.open })
}
 TransitionUp = (props)=> {
  return <Slide {...props} direction="up" />;
}

 render()
 {
  return (
    <div>
        <Snackbar
    open={this.state.open}
    onClose={this.handleClose}
    TransitionComponent={this.TransitionUp}
    autoHideDuration={5000}
    
    >
<SnackbarContent style={{
  backgroundColor:this.props.color === "danger"? '#ffae42' :'#4BB543',
  fontSize: 14
}}
message={<span id="client-snackbar"><i class={this.props.color === "danger" ? "fa fa-close":"fa fa-check"} aria-hidden="true"></i> &nbsp;&nbsp;{this.props.message}</span>}
action={
      <React.Fragment>
        
        <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </React.Fragment>
    }
/>
</Snackbar>
    </div>
    
  ) ; 
 }
  
}