import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import FormGroup from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel'
import makeStyles from '@material-ui/core/styles/makeStyles';
import useEventSubscriber from '../../hooks/eventSubscriberHook';
import { PROFILE_EVENTS } from '../../constants/eventTypes';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef, useCallback } from 'react';
import { OutlinedInput, InputLabel, FormControl, InputAdornment, IconButton} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

import { remoteFetchUser } from '../../data-source/profileDataSource';
import { updateUser } from '../../actions/profileActions';


const useStyles = makeStyles({
    form : {
        marginLeft : '1.8rem',
        marginRight : '1.8rem'        
    },
    txtField : {
        minWidth : 420,
        marginTop : '0.5rem',
        marginBottom : '0.5rem'
    },
    resetBtnSpace : {
      marginRight : '0.70rem'      
    },
    saveBtnSpace : {
      marginRight : '0.25rem'
    },
    groupLabel : {
      marginTop : '0.45rem',
      marginBottom : '0.15rem'
    },
    newPasswordTxtFild : {
      marginTop : '0.35rem',
      marginBottom : '0.5rem'
    }
});

const EDIT_PASSWORD_DEFAULT_STATE = {
  oldPassword : "",
  showOldPassword : false,
  newPassword : "",
  showNewPassword : false
};

/**
 * User is stored locally in user state, fetched every time component mounts
 * and is independent of authentication data (auth in reducer store)
 * Component is uncontrolled, except for edit password fields, because there is a bag with
 * show visible password and uncontrolled components
 */
export default function Profile(props){
    const profileEmitter = useSelector( store => store.events.profileEmitter );    

    const [user, setUser] = useState(null);    
    const [editPasswordState, setEditPasswordState] = useState(EDIT_PASSWORD_DEFAULT_STATE);

    const userId = useSelector( store => store.auth.userId);    
    const dispatch = useDispatch();    
        

    const fullNameRef = useRef(null);
    const emailRef = useRef(null);    

    function applyChanges(){      
      dispatch( 
        updateUser( 
            fullNameRef.current.value, 
            emailRef.current.value, 
            editPasswordState.oldPassword,
            editPasswordState.newPassword,
            {...user} ))
    }

    function handleClickShowOldPassword(){
      setEditPasswordState( {
        ...editPasswordState, 
        showOldPassword : ! editPasswordState.showOldPassword
      });
    }

    function handleClickShowNewPassword(){
      setEditPasswordState( {
        ...editPasswordState, 
        showNewPassword : ! editPasswordState.showNewPassword
      });
    }

    function handleMouseDownPassword(event){
      event.preventDefault();
    }

    const remoteFetchUserStoredCallback = useCallback(
      async function (){                
        let tempUser = await remoteFetchUser(userId);                   
        setUser( tempUser );        
      },
      [userId, setUser]
    );

    const resetUiState = useCallback( function( ){        
        if(fullNameRef.current !== null) fullNameRef.current.value = user.fullName;
        if(emailRef.current !== null) emailRef.current.value = user.email;
        setEditPasswordState(EDIT_PASSWORD_DEFAULT_STATE)
      }
      , [fullNameRef, emailRef, user] )
          
    
    useEventSubscriber(profileEmitter, PROFILE_EVENTS.RESET_UI_INPUT_VALUES, resetUiState );

    const classes = useStyles();


    useEffect(
      () => {        
        remoteFetchUserStoredCallback()
      } ,
      [remoteFetchUserStoredCallback])


    useEventSubscriber(profileEmitter, PROFILE_EVENTS.REFETCH_USER_ACCOUNT, remoteFetchUserStoredCallback);      

    const onHandlePasswordChangeFactory = ( passwordKind ) => ( event ) => {
      setEditPasswordState({
        ...editPasswordState,
        [passwordKind + 'Password'] : event.target.value
      })
    }

    return (
      user &&      
        <form className={classes.form} >            
            <TextField 
              InputLabelProps={{shrink : true}}
              className={classes.txtField} label='Full name' 
              variant='outlined' fullWidth={true} inputRef={fullNameRef}
              defaultValue={user.fullName} />
            <TextField 
              className={classes.txtField} label='Email'
              variant='outlined' fullWidth={true} disabled inputRef={emailRef}
              defaultValue={user.email} />
            <FormGroup fullWidth={true} className={classes.txtField} variant='outlined' >
              <FormLabel className={classes.groupLabel} component='legend'>Change password:</FormLabel>
              <FormControl fullWidth={true} className={classes.txtField} variant='outlined' >
                <InputLabel 
                  htmlFor="outlined-adornment-oldpassword" variant='outlined' >Old password</InputLabel>
                <OutlinedInput               
                  id="outlined-adornment-oldpassword"                                
                  value={editPasswordState.oldPassword}
                  type={editPasswordState.showOldPassword ? 'text' : 'password'} variant='outlined'              
                  onChange={onHandlePasswordChangeFactory('old')}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowOldPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >            
                    {editPasswordState.showOldPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  labelWidth={99}
                  />
                </FormControl>
                <FormControl fullWidth={true} variant='outlined' className={classes.newPasswordTxtFild} >
                <InputLabel 
                  htmlFor="outlined-adornment-newpassword" variant='outlined' >New password</InputLabel>
                <OutlinedInput               
                  id="outlined-adornment-newpassword"                                
                  value={editPasswordState.newPassword}
                  type={ editPasswordState.showNewPassword ? 'text' : 'password'} variant='outlined'                   
                  onChange={ onHandlePasswordChangeFactory('new')}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowNewPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >            
                    {editPasswordState.showNewPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  labelWidth={107}
                  />
                </FormControl>
              </FormGroup>

                <Box display="flex" flexDirection="row" justifyContent="flex-end">
                  <Button className={classes.resetBtnSpace} color="primary" variant='text'
                          onClick={resetUiState} >Reset</Button>
                  <Button className={classes.saveBtnSpace} type='submit' color="primary" variant='contained'
                          onClick={(event) => { event.preventDefault(); applyChanges() } } >Save</Button>            
                </Box>
            
        </form>              
    );
}