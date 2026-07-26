import './wrappedLinkListItem.css';
import Box from '@material-ui/core/Box';


import ListItem from '@material-ui/core/ListItem'

export default function WrappedLinkListItem( props ){

    return (
        <Box  className={ props.isActive ? "drawerItemActive" : ""} component={ListItem} >            
            {props.listItem}            
        </Box>        
    );

}