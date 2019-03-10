import {
    CLEAR_READY_TO_GO, 
    READY_TO_GO_ADD, 
    CLEAR_RECENT, 
    CLEAR_RECOMMENDED, 
    ADD_RECENT, 
    ADD_RECOMMENDED, 
    CLEAR_SEARCH,
    ADD_SEARCH,
    FOUND_RECIPES,
    NO_RECIPES_FOUND,
} from '../actions/RecipeAction';

/**
 * Reducer for ready to go recipes to apply actions to the store.
 * @param {array} state The current store state for ready to go recipes
 * @param {object} action The action to apply to the store
 */
export function readyToGoRecipes(state = [], action) {
    switch(action.type) {
        case CLEAR_READY_TO_GO:
            return [];
        case READY_TO_GO_ADD:
            var newArr = [...state];
            newArr.push(action.payload);
            return newArr;
        default:
            return state;
    }
}

/**
 * Reducer for recommended recipes to apply actions to the store.
 * @param {array} state The current store state for ready to go recipes
 * @param {object} action The action to apply to the store
 */
export function recommendedRecipes(state = [], action) {
    switch(action.type) {
        case CLEAR_RECOMMENDED:
            return [];
        case ADD_RECOMMENDED:
            var newArr = [...state];
            newArr.push(action.payload);
            return newArr;
        default:
            return state;
    }
}

/**
 * Reducer for recent recipes to apply actions to the store.
 * @param {array} state The current store state for ready to go recipes
 * @param {object} action The action to apply to the store
 */
export function recentRecipes(state = [], action) {
    switch(action.type) {
        case CLEAR_RECENT:
            return [];
        case ADD_RECENT:
            var newArr = [...state];
            newArr.push(action.payload);
            return newArr;
        default:
            return state;
    }
}

export function searchRecipes(state = [], action) {
    switch(action.type) {
        case CLEAR_SEARCH:
            return [];
        case ADD_SEARCH:
            var newArr = [...state];
            newArr.push(action.payload);
            return newArr;
        default:
            return state;
    }
}

export function searchRecipesFound(state = [], action) {
    switch(action.type) {
        case FOUND_RECIPES:
            return [true];
        case NO_RECIPES_FOUND:
            return [false];
        default:
            return state;
    }
}
