import { createStore, combineReducers, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk"
import { name, loginUser, cookNow } from "./reducers/reducer";

const store = createStore(
    combineReducers({
        name: name,
        loginUser: loginUser,
        cookNow: cookNow,
    }),
    {},
    applyMiddleware(reduxThunk)
);

export default store;
