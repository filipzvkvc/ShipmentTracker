import ACTIONS from '../constants/actionTypes';

const initialState = {
  data: null,
};

export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.USERS.SET_ALL:
      return { ...state, data: action.payload };
    case ACTIONS.USERS.ADD:
      return { ...state, data: [...state.data, action.payload] };
    case ACTIONS.USERS.UPDATE:
      return { ...state, data: state.data.map(u => u.userId === action.payload.userId ? { ...u, ...action.payload } : u) };
    case ACTIONS.USERS.REMOVE:
      return { ...state, data: state.data.filter(u => u.userId !== action.payload) };
    case ACTIONS.AUTH.LOG_OUT:
      return initialState;
    default:
      return state;
  }
}
