import { CLEAR_PANTRY, ADD_PANTRY } from '../actions/PantryAction';

export function pantry(state = [], action) {
    switch(action.type) {
        case CLEAR_PANTRY:
            return [];
        case ADD_PANTRY:
            var newArr = [...state];
            newArr.push(action.payload);
            return newArr;
        default:
            return state;
    }
}