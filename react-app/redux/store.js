import { createStore, combineReducers, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import { loginUser } from "./reducers/reducer";
import {readyToGoRecipes, recommendedRecipes, recentRecipes} from './reducers/RecipesReducer'

const store = createStore(
    combineReducers({
        readyToGoRecipes: readyToGoRecipes,
        recommendedRecipes: recommendedRecipes,
        recentRecipes: recentRecipes,
        loginUser: loginUser,
    }), 
    {},
    applyMiddleware(reduxThunk)
);

export default store