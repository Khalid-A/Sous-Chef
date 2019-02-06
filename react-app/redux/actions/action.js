export const SET_NAME = "SET_NAME"
export const SET_USER_ID = "SET_USER_ID"
export const ADD_RECIPE = "ADD_RECIPE"
import firebase from 'react-native-firebase';


export function setName(name) {
    return { type: SET_NAME, text: name }
}

export function setUserId(userId) {
    return { type: SET_USER_ID, text: userId }
}

// const addRecipeRef = firebase.firestore().collection('recipes');

export function addRecipe(recipe) {

    return { type: ADD_RECIPE, text: recipe }
}
