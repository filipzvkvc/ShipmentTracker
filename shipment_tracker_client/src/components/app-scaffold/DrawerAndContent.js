import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import LogoutIcon from './LogoutIcon'

import { getDrawerItemsByUserType } from '../../services/drawerItemsUtils';

import MainContent from "./MainContent";
import WrappedLinkListItem from './WrappedLinkListItem';
import AppSnackbar from '../common/AppSnackbar';

import { useHistory, useRouteMatch } from 'react-router-dom';
import 'fontsource-roboto';
import SETTINGS from  '../../Settings';
import { useDispatch, useSelector } from "react-redux";
import { logOutLocally } from "../../actions/authActions";
import { DRAWER_ROUTES_PATHS_ARRAY  } from '../../constants/drawerItemsConstants'

const { CUSTOM_ITEM_ACTIVATED } = SETTINGS.DRAWER;

//const drawerWidth = 240;
const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  grow : {
    flexGrow : 1
  },
  root: {
    display: "flex"
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
    /*
    [theme.breakpoints.up('sm')]: {
      //width: `calc(100% - ${drawerWidth}px)`,
      width : 300,
      marginLeft: drawerWidth,
    },
    */
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },

}));

//custom hoock
function useListItemLinkMatch( ){  
  const matchDevicesPath = useRouteMatch( DRAWER_ROUTES_PATHS_ARRAY )?.path;  
  return ( argItemMatch) => matchDevicesPath === argItemMatch
}


function DrawerAndContent(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const history = useHistory();
  const dispatch = useDispatch();
  
  const doesListItemMatch = useListItemLinkMatch();    

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logOutLocally() );
  }

  const userType = useSelector( store => store.auth.userType);

  
  const drawerContent = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        { getDrawerItemsByUserType( userType )          
          .map((item, index) => (          
          <ListItem button  key={item.title} 
              selected={!CUSTOM_ITEM_ACTIVATED && doesListItemMatch(item.match)} 
              onClick={()=> history.push(item.match) }>
            {CUSTOM_ITEM_ACTIVATED ?            
            ( <WrappedLinkListItem
                listItem= {
                  <>
                    <ListItemIcon>
                      {item.icon}
                    </ListItemIcon>                    
                    <ListItemText primary={item.title}  /> 
                </>}
                isActive={ doesListItemMatch(item.match) } />
              )
                :
              (
                <>
                  <ListItemIcon>
                    {item.icon}
                    </ListItemIcon>                    
                  <ListItemText primary={item.title}  /> 
                  </>
              )
              }
            
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton            
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap style={{flexGrow : 1}} >
            Shipment Tracker
          </Typography>

          <IconButton
            color="inherit"            
            edge="end"    
            onClick={handleLogout}                    
          >
            <LogoutIcon />
          </IconButton>

        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {drawerContent}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper
            }}
            variant="permanent"
            open
          >
            {drawerContent}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <MainContent />
      </main>
      <AppSnackbar />
    </div>
  );
}

DrawerAndContent.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func
};

export default DrawerAndContent;
