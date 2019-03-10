import { createStore, combineReducers, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import { pantry, itemsToRemove } from './reducers/PantryReducer';
import { userInfo } from "./reducers/AuthenticationReducer";
import { readyToGoRecipes, recommendedRecipes, recentRecipes, searchRecipes } from './reducers/RecipesReducer';
import { groceryList } from './reducers/GroceryListReducer';

const store = createStore(
    combineReducers({
        readyToGoRecipes: readyToGoRecipes,
        recommendedRecipes: recommendedRecipes,
        recentRecipes: recentRecipes,
        searchRecipes: searchRecipes,
        pantry: pantry,
        userInfo: userInfo,
        groceryList: groceryList,
        itemsToRemove: itemsToRemove,
    }), 
    {},
    applyMiddleware(reduxThunk)
);

export default store