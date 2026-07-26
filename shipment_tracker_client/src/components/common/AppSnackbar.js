import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

import { useSelector, useDispatch} from 'react-redux';

import {showMessage,hideAndRemoveMessage} from '../../actions/messageActions';


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function AppSnackbar(props) {
  const classes = useStyles();
  const msg = useSelector( store => store.message);
  const dispatch = useDispatch();

  //const [open, setOpen] = React.useState(false);

  function testMessage( argMessage){
    dispatch( showMessage( "Hello world", null ));
  }
  

  const handleClick = () => {
    //setOpen(true);
    dispatch( hideAndRemoveMessage() );
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    //setOpen(false);
    dispatch( hideAndRemoveMessage() );
  };

  return (
    <div className={classes.root}>      
      { msg.messageType !== null ? (
        <Snackbar open={msg.hasMessage} autoHideDuration={props.autoHideDuration} onClose={handleClose}>
            <Alert onClose={handleClose} severity={msg.messageType}>
            { msg.message}
          </Alert> 
        </Snackbar>) 
        : ( 
        <Snackbar open={msg.hasMessage} message={msg.message} autoHideDuration={props.autoHideDuration} onClose={handleClose}/> ) }      
    </div>
  );
}

AppSnackbar.defaultProps = {
  autoHideDuration : 6000
};