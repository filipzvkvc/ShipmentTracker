import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import blue from '@material-ui/core/colors/blue';
import Backdrop from '@material-ui/core/Backdrop';

const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff"
    },
  
    title: {
      color: blue[400],
      marginBottom : 20
    },
    
  }));    

export default function Progress(props){
    const classes = useStyles();

    return (
        <Backdrop open={true} invisible={ props.withoutBackground} >
        { /* <Grid container style={{height : '100vh', width : '100vw'}}  alignItems='center' justify='center' alignContent='center' justifyContent='center' > */ }
            <Grid container direction='column' alignItems='center' justifyContent='center' alignContent='center'>
                <Grid item>
                    <Typography className={classes.title } variant='h4' > {props.title} </Typography>
                </Grid>
                <Grid item >
                    <CircularProgress />
                </Grid>
            </Grid>
        { /*</Grid> */ }
        </Backdrop>
        
    )
}

Progress.defaultProps = {
    withoutBackground : true    
}