import ACTIONS from '../constants/actionTypes';

const initialState = {
  data: [],
  userSubShipments: null,
  formData: { users: [], itemTypes: [], statuses: [] },
  statuses: [],
  loading: false,
};

export default function subShipmentsReducer(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.SUB_SHIPMENTS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SUB_SHIPMENTS.SET_DATA:
      return { ...state, data: action.payload, loading: false };
    case ACTIONS.SUB_SHIPMENTS.SET_USER_DATA:
      return { ...state, userSubShipments: action.payload };
    case ACTIONS.SUB_SHIPMENTS.SET_FORM_DATA:
      return { ...state, formData: action.payload, statuses: action.payload.statuses };
    case ACTIONS.SUB_SHIPMENTS.SET_STATUSES:
      return { ...state, statuses: action.payload };
    case ACTIONS.SUB_SHIPMENTS.UPDATE:
      return { ...state, data: state.data.map(ss => ss.id === action.payload.id ? action.payload : ss) };
    case ACTIONS.SUB_SHIPMENTS.UPDATE_PROOF:
      return { ...state, data: state.data.map(ss => ss.id === action.payload.id ? { ...ss, proof: action.payload.proof } : ss) };
    case ACTIONS.SUB_SHIPMENTS.REMOVE:
      return { ...state, data: state.data.filter(ss => ss.id !== action.payload) };
    case ACTIONS.SUB_SHIPMENTS.CLEAR:
      return { ...state, data: [] };
    case ACTIONS.AUTH.LOG_OUT:
      return initialState;
    default:
      return state;
  }
}
