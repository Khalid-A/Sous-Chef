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

export const signInSuccess = (dispatch, userID, email) =>{
    const groceryID = uuid4();
    const pantryID = uuid4();
    const relevantRecipesID = uuid4();
    
    const userInfo = {
        userID: userID,
        email: email,
        groceryID: groceryID,
        pantryID: pantryID,
        relevantRecipesID: relevantRecipesID
    }

    firebase.firestore().collection('users').doc(userID).set(userInfo)
    firebase.firestore().collection('relevantrecipes').doc(relevantRecipesID).set({
            userID: userID
    })

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