import {
    SET_NAME,
    ADD_RECIPE,
} from '../actions/action'

function name(state = {}, action) {
    switch(action.type) {
        case SET_NAME:
            console.warn("setting name to: " + action.text)
            return {
                name: action.text
            }
    }
}

export function recipe(state, action){
  switch(action.type) {
    case ADD_RECIPE:
    console.warn("setting recipe to: " + action.payload)
    return {
      ...state,
      newRecipe: action.payload,
    }
  }
}

export default function sousChefApp(state = {}, action) {
    return {
      name: name(state.name, action),
    }
  }
