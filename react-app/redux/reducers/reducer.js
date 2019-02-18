import {
  SET_INGREDIENTS_TO_REMOVE
} from '../actions/action'

/**
* Reducer for Cook Now Lifecycle to apply actions to the store
* @param {array} state The current store state for userId
* @param {object} action The action to apply to the store
*/
export function cookNow(state = {}, action) {
  switch(action.type) {
    case SET_INGREDIENTS_TO_REMOVE:
    return Object.assign({}, state, {
      ingredientsToRemove: action.payload,
    });
    default:
    return state
  }
}
