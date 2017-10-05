import axios from "axios";

const initialState = {
  user: {}
};

const GET_USER_INFO = "GET_USER_INFO";

export function getUserInfo() {
  const userData = axios.get("/auth/me").then(res => {
    return res.data;
  });
  return {
    type: GET_USER_INFO,
    payload: userData
  };
}

export default function reducer(state = initialState, action) {
  //Reducer always takes in these two arguments.
  // We always set the state to initial state so if no state is ever given then state will be the initial state when boot up.
  switch (action.type) {
    case GET_USER_INFO + "_FULFILLED":
      return Object.assign({}, state, { user: action.payload }); //This is how it will tell when it will be fulfilled. When the data actually comes back.
    default:
      return state;
  }
}
