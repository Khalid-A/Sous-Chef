import { createStore, combineReducers, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import { userInfo } from "./reducers/AuthenticationReducer";
import { readyToGoRecipes, recommendedRecipes, recentRecipes } from './reducers/RecipesReducer'

const store = createStore(
    combineReducers({
        readyToGoRecipes: readyToGoRecipes,
        recommendedRecipes: recommendedRecipes,
        recentRecipes: recentRecipes,
        userInfo: userInfo,
    }), 
    {},
    applyMiddleware(reduxThunk)
);

export default store