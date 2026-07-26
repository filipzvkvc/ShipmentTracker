import ACTIONS from '../constants/actionTypes';

const initialState = {
  data: null,
};

export default function countriesReducer(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.COUNTRIES.SET_ALL:
      return { ...state, data: action.payload };
    case ACTIONS.COUNTRIES.ADD:
      return { ...state, data: [...state.data, action.payload] };
    case ACTIONS.COUNTRIES.UPDATE:
      return { ...state, data: state.data.map(c => c.id === action.payload.id ? { ...c, ...action.payload } : c) };
    case ACTIONS.COUNTRIES.REMOVE:
      return { ...state, data: state.data.filter(c => c.id !== action.payload) };
    case ACTIONS.AUTH.LOG_OUT:
      return initialState;
    default:
      return state;
  }
}
