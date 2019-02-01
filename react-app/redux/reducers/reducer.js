import {
    SET_NAME
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

export default function sousChefApp(state = {}, action) {
    return {
      name: name(state.name, action),
    }
  }