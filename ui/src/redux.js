import { createStore } from "redux";

// actions
const actions = {
  SET_AADHAAR: "SET_AADHAAR",
  LOGOUT: "LOGOUT",
};

// action creator
export const setAadhaar = (aadhaar) => ({
  type: actions.SET_AADHAAR,
  payload: { aadhaar },
});

export const logout = () => ({
  type: actions.LOGOUT,
  payload: null,
});

// reducer
const initState = {
  aadhaar: null,
};
const reducer = (state = initState, action) => {
  switch (action.type) {
    case actions.SET_AADHAAR:
      return { aadhaar: action.payload.aadhaar };
    case actions.LOGOUT:
      return { aadhaar: null };

    default:
      return state;
  }
};

// store
const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
