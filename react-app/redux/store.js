import { createStore, combineReducers, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import { pantry, itemsToRemove } from './reducers/PantryReducer';
import { userInfo } from './reducers/AuthenticationReducer';
import { favoritedTracker } from './reducers/FavoritedReducer';
import {
    readyToGoRecipes,
    recommendedRecipes,
    recentRecipes,
    searchRecipes,
    searchRecipesFound,
} from './reducers/RecipesReducer';
import { groceryList } from './reducers/GroceryListReducer';

const store = createStore(
    combineReducers({
        readyToGoRecipes: readyToGoRecipes,
        recommendedRecipes: recommendedRecipes,
        recentRecipes: recentRecipes,
        searchRecipes: searchRecipes,
        searchRecipesFound: searchRecipesFound,
        pantry: pantry,
        userInfo: userInfo,
        groceryList: groceryList,
        itemsToRemove: itemsToRemove,
        favoritedTracker: favoritedTracker,
    }), 
    {},
    applyMiddleware(reduxThunk)
);

export default store