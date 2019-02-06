import { LOGIN_FAILURE, LOGIN_SUCCESS } from '../actions/action'

/**
 * Reducer for userId to apply actions to the store
 * @param {array} state The current store state for userId
 * @param {object} action The action to apply to the store
 */
 export function userInfo(state = {}, action) {
    switch(action.type) {
        case LOGIN_SUCCESS:
            return Object.assign({}, state, {
                errorMessage: '',
                userId: action.payload.userId,
                email: action.payload.email,
                groceryId: action.payload.groceryId,
                pantryId: action.payload.pantryId,
                relevantRecipesId: action.relevantRecipesId,
              });
        case LOGIN_FAILURE:
            return Object.assign({}, state, {
                errorMessage: action.payload,
                userId: '',
                email: action.email,
            });
        default:
            return state;
    }
}