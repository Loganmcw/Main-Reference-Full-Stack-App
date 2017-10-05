import { createStore, applyMiddleware } from "redux"; //You import from redux when it is just trying to access redux alone;
//You import react-redux when it is something that interacts with both such as {connect}.
import users from "./ducks/users";
import promiseMiddleware from "redux-promise-middleware";

export default createStore(users, applyMiddleware(promiseMiddleware()));
