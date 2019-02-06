import { createStore, combineReducers, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import { loginUser } from "./reducers/reducer";
import {readyToGoRecipes, recommendedRecipes, recentRecipes} from './reducers/RecipesReducer'
import {pantry} from './reducers/PantryReducer';

const store = createStore(
    combineReducers({
        readyToGoRecipes: readyToGoRecipes,
        recommendedRecipes: recommendedRecipes,
        recentRecipes: recentRecipes,
        loginUser: loginUser,
        pantry: pantry
    }), 
    {},
    applyMiddleware(reduxThunk)
);

export default store