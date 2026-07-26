import { useDispatch, useSelector } from "react-redux";
import DrawerAndContent from './DrawerAndContent';
import Login from './Login/Login';
import ForgotPassword from './Login/ForgotPassword';
import ResetPassword from './Login/ResetPassword';
import TryAgain from './Login/TryAgain';
import AppSnackbar from '../common/AppSnackbar';
import { getTokenAndUserId, getUserId} from '../../data-source/authDataSource';
import Progress from '../common/Progress';
import { useEffect } from "react";
import { fetchAndStoreUser, clearUser, logOutLocally, setFetchingUser} from '../../actions/authActions';
import { Switch, Redirect, Route }  from 'react-router-dom';


function LoginAndSnackbar(props){
  return (
    <>
      <Login />
      <AppSnackbar />                        
    </> 
  ) 
}

export default function App(props){
    const auth = useSelector( store => store.auth);
    const dispatch = useDispatch();

    const tempTokenAndUserId = getTokenAndUserId();
    
    useEffect( 
      () => {
        if(tempTokenAndUserId != null){          
          dispatch( fetchAndStoreUser( tempTokenAndUserId.userId ) )                    
        }else {
          dispatch( setFetchingUser(false) )
        }        
      },
      []);

    return (
      auth.isLogged ? (          
            <DrawerAndContent />                                  
        ) : (
          auth.fetchingUser ? (
            <Progress withoutBackground={true} title="Loging in" />
          ) : (
            tempTokenAndUserId == null  ? ( 
            <Switch>
              <Route exact path='/login' component={LoginAndSnackbar} />
              <Route exact path='/forgotpassword' component={ForgotPassword} />
              <Route exact path='/resetpassword' component={ResetPassword} />
              <Redirect path='/' to='/login' />
            </Switch>
            ) : (
              <>
                <TryAgain 
                  primaryBtnTitle="Try again" 
                  primaryBtnActionCreator={ () => fetchAndStoreUser( getUserId() ) }
                  secondaryBtnTitle='Back to login screen'
                  secondaryBtnActionCreator={ logOutLocally } />
                <AppSnackbar autoHideDuration={1500}  />
              </>
            )            
          ) 
        )        
    );
}