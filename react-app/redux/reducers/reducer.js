import {
  SET_NAME,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  SET_INGREDIENTS_TO_REMOVE
} from '../actions/action'

export function name(state = {}, action) {
  switch(action.type) {
    case SET_NAME:
    console.warn("setting name to: " + action.text)
    return {
      name: action.text
    }
    default:
    return state
  }
}

/**
* Reducer for userId to apply actions to the store
* @param {array} state The current store state for userId
* @param {object} action The action to apply to the store
*/
export function loginUser(state = {}, action) {
  switch(action.type) {
    case LOGIN_SUCCESS:
    return Object.assign({}, state, {
      errorMessage: '',
      userId: action.payload
    });
    case LOGIN_FAILURE:
    return Object.assign({}, state, {
      errorMessage: action.payload,
      userId: ''
    });
    default:
    return state;
  }
}

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
