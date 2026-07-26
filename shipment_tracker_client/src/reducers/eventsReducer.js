import EventEmitter from 'events';

const initialState = {    
    profileEmitter : new EventEmitter()
}

export default function eventsReducer(state = initialState, action){
    return state;
}