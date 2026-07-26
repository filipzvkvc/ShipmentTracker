import HomeIcon from '@material-ui/icons/Home';
import SettingsIcon from '@material-ui/icons/Settings';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import PublicIcon from '@material-ui/icons/Public';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import CategoryIcon from '@material-ui/icons/Category';
import AssignmentIcon from '@material-ui/icons/Assignment';

export const DRAWER_ITEMS_IDS = {
  HOME : 0,
  USERS : 1,
  PROFILE_SETTINGS : 2,
  COUNTRIES : 3,
  SHIPMENTS : 4,
  ITEM_TYPES : 5,
  MY_SHIPMENTS : 6,
};

export const DRAWER_ROUTES_MAP = {
  [DRAWER_ITEMS_IDS.HOME] : '/home',
  [DRAWER_ITEMS_IDS.USERS] : '/users',
  [DRAWER_ITEMS_IDS.PROFILE_SETTINGS] : '/profile',
  [DRAWER_ITEMS_IDS.COUNTRIES] : '/countries',
  [DRAWER_ITEMS_IDS.SHIPMENTS] : '/shipments',
  [DRAWER_ITEMS_IDS.ITEM_TYPES] : '/item-types',
  [DRAWER_ITEMS_IDS.MY_SHIPMENTS] : '/my-shipments',
}

export const drawerItems = [
  {
    itemId : DRAWER_ITEMS_IDS.HOME,
    title : "Home",
    icon : <HomeIcon />,
    match : DRAWER_ROUTES_MAP[DRAWER_ITEMS_IDS.HOME]
  },
  {
    itemId : DRAWER_ITEMS_IDS.USERS,
    title : "Users",
    icon : <PeopleAltIcon />,
    match : DRAWER_ROUTES_MAP[DRAWER_ITEMS_IDS.USERS]
  },
  {
    itemId : DRAWER_ITEMS_IDS.COUNTRIES,
    title : "Countries",
    icon : <PublicIcon />,
    match : DRAWER_ROUTES_MAP[DRAWER_ITEMS_IDS.COUNTRIES]
  },
  {
    itemId : DRAWER_ITEMS_IDS.SHIPMENTS,
    title : "Shipments",
    icon : <LocalShippingIcon />,
    match : DRAWER_ROUTES_MAP[DRAWER_ITEMS_IDS.SHIPMENTS]
  },
  {
    itemId : DRAWER_ITEMS_IDS.ITEM_TYPES,
    title : "Item Types",
    icon : <CategoryIcon />,
    match : DRAWER_ROUTES_MAP[DRAWER_ITEMS_IDS.ITEM_TYPES]
  },
  {
    itemId : DRAWER_ITEMS_IDS.MY_SHIPMENTS,
    title : "My Shipments",
    icon : <AssignmentIcon />,
    match : DRAWER_ROUTES_MAP[DRAWER_ITEMS_IDS.MY_SHIPMENTS]
  },
  {
    itemId : DRAWER_ITEMS_IDS.PROFILE_SETTINGS,
    title : "Profile",
    icon :  <SettingsIcon />,
    match : DRAWER_ROUTES_MAP[DRAWER_ITEMS_IDS.PROFILE_SETTINGS]
  }
];


export const DRAWER_ROUTES_PATHS_ARRAY = Object.values( DRAWER_ROUTES_MAP );

export const userDrawerItemsIds = [DRAWER_ITEMS_IDS.HOME, DRAWER_ITEMS_IDS.MY_SHIPMENTS, DRAWER_ITEMS_IDS.PROFILE_SETTINGS];
export const adminDrawerItemsIds = [DRAWER_ITEMS_IDS.HOME, DRAWER_ITEMS_IDS.USERS, DRAWER_ITEMS_IDS.COUNTRIES, DRAWER_ITEMS_IDS.SHIPMENTS, DRAWER_ITEMS_IDS.ITEM_TYPES, DRAWER_ITEMS_IDS.PROFILE_SETTINGS];
export const clientDrawerItemsIds = [DRAWER_ITEMS_IDS.MY_SHIPMENTS, DRAWER_ITEMS_IDS.PROFILE_SETTINGS];

export default drawerItems;