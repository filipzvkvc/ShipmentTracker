import { createStore, applyMiddleware, compose} from 'redux';
import rootReducer from '../reducers/rootReducer';
import thunkMiddleware from 'redux-thunk';

const middleware = [thunkMiddleware];

// eslint-disable-next-line no-underscore-dangle
//let devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && 
//window.__REDUX_DEVTOOLS_EXTENSION__();

let devTools = window.__REDUX_DEVTOOLS_EXTENSION__
? window.__REDUX_DEVTOOLS_EXTENSION__()
: f => f

const store = createStore( 
        rootReducer, 
        compose( 
            applyMiddleware( ...middleware),            
            devTools
        )
 );



export default store; 