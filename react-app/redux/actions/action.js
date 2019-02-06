import firebase from 'react-native-firebase';
import uuid4 from 'uuid';

export const LOGIN_SUCCESS = "LOGIN_SUCCESS"
export const LOGIN_FAILURE = "LOGIN_FAILURE"

export const userInfo = (email, password) => {
    return (dispatch) => {
        firebase.auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => signInSuccess(
                dispatch, 
                firebase.auth().currentUser.uid, 
                email
            ))
            .catch(error => signInFailure(dispatch, error.message, email));
    }
}

export const signInSuccess = (dispatch, userId, email) =>{
    const groceryId = uuid4();
    const pantryId = uuid4();
    const relevantRecipesId = uuid4();
    
    var userInfo = {
        userId: userId,
        email: email,
        groceryId: groceryId,
        pantryId: pantryId,
        relevantRecipesId: relevantRecipesId,
    }

    firebase.firestore().collection('users').doc(userId).set(userInfo)

    dispatch({
        type: LOGIN_SUCCESS,
        payload: userInfo
    });
}

export function signInFailure(dispatch, errorMessage, email) {
    dispatch({
        type: LOGIN_FAILURE,
        payload: errorMessage,
        email: email
    });
}