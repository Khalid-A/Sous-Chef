import {
    SET_NAME,
    SET_USER_ID,
    ADD_RECIPE
} from '../actions/action'

function name(state = {}, action) {
    switch(action.type) {
        case SET_NAME:
            console.warn("setting name to: " + action.text)
            return {
                name: action.text,
            }
    }
}

function setUserId(state = {}, action) {
    switch(action.type) {
        case SET_USER_ID:
            return {
                user_id: action.text,
            }
    }
}

function addRecipe(state = {}, action) {
  switch(action.type) {
     case ADD_RECIPE:
     return {
         recipe: action.payload,
     }
  }
}

export default function sousChefApp(state = {}, action) {
    return {
      name: name(state.name, action),
      userId: setUserId(state.userId, action),
      recipe: addRecipe(state.recipe, action),
    }
}
