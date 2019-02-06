import firebase from 'react-native-firebase';

export const SET_NAME = "SET_NAME";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

//Cook Now Lifecycle actions
export const SET_INGREDIENTS_TO_REMOVE = "SET_INGREDIENTS_TO_REMOVE";



export function setName(name) {
    return { type: SET_NAME, text: name }
}

export const signUpUser = (email, password) => {
    return (dispatch) => {
        firebase.auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => signInSuccess(dispatch, firebase.auth().currentUser.uid))
            .catch(error => signInFailure(dispatch, error.message));
    }
}

export const signInSuccess = (dispatch, userId) =>{
    dispatch({
        type: LOGIN_SUCCESS,
        payload: userId
    });
}

export function signInFailure(dispatch, errorMessage) {
    dispatch({
        type: LOGIN_FAILURE,
        payload: errorMessage
    });
}

// Cook Now Lifecycle Actions

export const setIngredientsToRemove = (ingredients) => {
  return {
    type: SET_INGREDIENTS_TO_REMOVE,
    payload: ingredients,
  };
}
