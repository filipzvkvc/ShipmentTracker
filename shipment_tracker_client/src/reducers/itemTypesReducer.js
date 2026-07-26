import ACTIONS from '../constants/actionTypes';

const initialState = {
  data: null,
};

export default function itemTypesReducer(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.ITEM_TYPES.SET_ALL:
      return { ...state, data: action.payload };
    case ACTIONS.ITEM_TYPES.ADD:
      return { ...state, data: [...state.data, action.payload] };
    case ACTIONS.ITEM_TYPES.UPDATE:
      return { ...state, data: state.data.map(i => i.id === action.payload.id ? { ...i, ...action.payload } : i) };
    case ACTIONS.ITEM_TYPES.REMOVE:
      return { ...state, data: state.data.filter(i => i.id !== action.payload) };
    case ACTIONS.AUTH.LOG_OUT:
      return initialState;
    default:
      return state;
  }
}
