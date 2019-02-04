import { createStore, combineReducers, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import name from "./reducers/reducer";
import {readyToGoRecipes, recommendedRecipes, recentRecipes} from './reducers/RecipesReducer'

const store = createStore(
    combineReducers({
        name: name,
        readyToGoRecipes: readyToGoRecipes,
        recommendedRecipes: recommendedRecipes,
        recentRecipes: recentRecipes
    }), 
    {}, 
    applyMiddleware(reduxThunk)
);

export default store