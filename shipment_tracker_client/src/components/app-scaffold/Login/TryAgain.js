import React from "react";
import { Grid, Button, Box } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useDispatch } from 'react-redux'

const useStyle = makeStyles((theme) => ({
  button: {
    marginTop: "0.15rem",
    marginBottom: "0.15rem"
  }
}));

export default function TryAgain(props) {
  const classes = useStyle();
  const dispatch = useDispatch();

  const primaryBtnHandler = () => {
    if( props.primaryBtnActionCreator != null) dispatch( props.primaryBtnActionCreator() )
  }

  const secondaryBtnHandler = () => {
    if( props.secondaryBtnActionCreator != null) dispatch( props.secondaryBtnActionCreator() )
  }

  return (
    <Box
      display="flex"
      style={{ backgroundColor: "#ebf5fe", width: "100vw", height: "100vh" }}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Button className={classes.button} variant="contained" color="primary"
        onClick={ primaryBtnHandler} >
        {props.primaryBtnTitle}
      </Button>
      <Button 
        className={classes.button} variant="text" color="primary"
        onClick={secondaryBtnHandler} >
        {props.secondaryBtnTitle}
      </Button>
    </Box>
  );
}

TryAgain.defaultProps = {
  primaryBtnTitle : "Try again",
  secondaryBtnTitle : "Back to login screen"
}