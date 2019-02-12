import firebase from 'react-native-firebase';

export const SET_NAME = "SET_NAME";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";





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
