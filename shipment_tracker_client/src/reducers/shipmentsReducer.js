import ACTIONS from '../constants/actionTypes';

const initialState = {
  data: [],
  statuses: [],
  loading: false,
};

export default function shipmentsReducer(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.SHIPMENTS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SHIPMENTS.SET_ALL:
      return { ...state, data: action.payload, loading: false };
    case ACTIONS.SHIPMENTS.SET_STATUSES:
      return { ...state, statuses: action.payload };
    case ACTIONS.SHIPMENTS.ADD:
      return { ...state, data: [action.payload, ...state.data] };
    case ACTIONS.SHIPMENTS.UPDATE:
      return { ...state, data: state.data.map(s => s.id === action.payload.id ? action.payload : s) };
    case ACTIONS.SHIPMENTS.REMOVE:
      return { ...state, data: state.data.filter(s => s.id !== action.payload) };
    case ACTIONS.AUTH.LOG_OUT:
      return initialState;
    default:
      return state;
  }
}
