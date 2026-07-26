import { Switch, Route, Redirect } from "react-router-dom";
import { useSelector } from 'react-redux';
import Home from '../Home/Home';
import Users from '../Users/Users';
import ProfileSettings from '../Profile/Profile';
import Countries from '../Countries/Countries';
import Shipments from '../Shipments/Shipments';
import ItemTypes from '../ItemTypes/ItemTypes';
import AppSnackbar from '../common/AppSnackbar';
import { USER_TYPES } from '../../constants/userTypes';
import MyShipments from '../MyShipments/MyShipments';

function AdminRoute({ component: Component, ...rest }) {
  const userType = useSelector(state => state.auth.userType);
  return (
    <Route {...rest} render={() =>
      userType === USER_TYPES.ADMIN ? <Component /> : <Redirect to="/my-shipments" />
    } />
  );
}

function HomeRoute({ component: Component, ...rest }) {
  const userType = useSelector(state => state.auth.userType);
  return (
    <Route {...rest} render={() =>
      userType === USER_TYPES.CLIENT ? <Redirect to="/my-shipments" /> : <Component />
    } />
  );
}

export default function MainContent() {
  const userType = useSelector(state => state.auth.userType);
  const defaultRoute = userType === USER_TYPES.CLIENT ? '/my-shipments' : '/home';

  return (
    <>
      <Switch>
        <HomeRoute path='/home' component={Home} />
        <AdminRoute path='/users' component={Users} />
        <AdminRoute path='/countries' component={Countries} />
        <AdminRoute path='/shipments' component={Shipments} />
        <AdminRoute path='/item-types' component={ItemTypes} />
        <Route path='/my-shipments' component={MyShipments} />
        <Route path='/profile' component={ProfileSettings} />
        <Redirect exact from='/login' to={defaultRoute} />
        <Redirect to={defaultRoute} />
      </Switch>
      <AppSnackbar />
    </>
  );
}
