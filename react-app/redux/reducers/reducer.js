import {
    SET_NAME
} from '../actions/action'

export function name(state = {}, action) {
    switch(action.type) {
        case SET_NAME:
            console.warn("setting name to: " + action.text)
            return {
                name: action.text
            }
    }
}