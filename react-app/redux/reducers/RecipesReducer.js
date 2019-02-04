import {
    READY_TO_GO_UPDATED, RECOMMENDED_UPDATED, RECENT_UPDATED
} from '../actions/RecipeAction'

/**
 * Reducer for ready to go recipes to apply actions to the store.
 * @param {array} state The current store state for ready to go recipes
 * @param {object} action The action to apply to the store
 */
export function readyToGoRecipes(state = [], action) {
    switch(action.type) {
        case READY_TO_GO_UPDATED:
            return action.payload;
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
        case RECOMMENDED_UPDATED:
            return action.payload;
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
        case RECENT_UPDATED:
            return action.payload;
        default:
            return state;
    }
}