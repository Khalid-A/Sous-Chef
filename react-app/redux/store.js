import { createStore, combineReducers, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk"
import { name, loginUser } from "./reducers/reducer";

const store = createStore(
    combineReducers({
        name: name,
        loginUser: loginUser,
    }),
    {},
    applyMiddleware(reduxThunk)
);

export default store