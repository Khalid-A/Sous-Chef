import { createStore, combineReducers, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import {pantry} from './reducers/PantryReducer';
import { userInfo } from "./reducers/AuthenticationReducer";
import { readyToGoRecipes, recommendedRecipes, recentRecipes } from './reducers/RecipesReducer'

const store = createStore(
    combineReducers({
        readyToGoRecipes: readyToGoRecipes,
        recommendedRecipes: recommendedRecipes,
        recentRecipes: recentRecipes,
        pantry: pantry,
        userInfo: userInfo,
    }), 
    {},
    applyMiddleware(reduxThunk)
);

export default store