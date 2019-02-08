import firebase from 'react-native-firebase';
import uuid4 from 'uuid';

export const LOGIN_SUCCESS = "LOGIN_SUCCESS"
export const LOGIN_FAILURE = "LOGIN_FAILURE"

/**
 * usersRef: Reference to the all users collection in firestore.
 */
const usersRef = firebase.firestore().collection('users')

/**
 * createUser is a function that given an email and a password,
 * will either create a user acouunt in firebase and will also generate
 * the relevant collections in Firebase and the IDs to be associated 
 * with the user. 
 * 
 * @param {string} email: user's email address
 * @param {string} password: user's password
 */
export const createUser = (email, password) => {
    return (dispatch) => {
        firebase.auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => signInSuccess(
                dispatch, 
                firebase.auth().currentUser.uid, 
                email
            ))
            .catch(error => authenticationFailure(dispatch, error.message, email));
    }
}

/**
 * signInUser is a function that given an email and a password,
 * will set the user to be the current user in firebase and will retreive
 * the IDs associated with this user from Firebase.
 * 
 * @param {string} email: user's email address
 * @param {string} password: user's password
 */
export const loginUser = (email, password) => {
    return (dispatch) => {
        firebase.auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => loginSuccess(
                dispatch,
                firebase.auth().currentUser.uid,
                email
            ))
            .catch(error => authenticationFailure(dispatch, error.message, email));
    }
}

/**
 * loginSuccess retrieves information about the current user from Firebase 
 * and dispatches a redux action to update all IDs associated with the 
 * user in store.
 * 
 * @param {function} dispatch: dispatch function for redux
 * @param {string} userID: the userID of the user in question
 * @param {boolean} email: the email of the user in question
 */
export const loginSuccess = (dispatch, userID, email) => {
    usersRef.where("userID", "=", userID).onSnapshot(
        function(doc) {
            if (!(doc.docs.length == 1)) {
                console.warn('Error: multiple users with same user id')
            }
            const userInfo = doc.docs[0].data()
            dispatch({
                type: LOGIN_SUCCESS,
                payload: userInfo
            })
        }
    );
}

/**
 * signInSuccess creates unique IDs that will be associated with a
 * particular user and creates necessary documents in Firebase to
 * store these new IDs.
 * 
 * @param {function} dispatch: dispatch function for redux
 * @param {string} userID: the userID of the user in question
 * @param {email} email: the email of the user in question
 */
export const signInSuccess = (dispatch, userID, email) => {
    const groceryID = uuid4();
    const pantryID = uuid4();
    const relevantRecipesID = uuid4();
    
    const userInfo = {
        userID: userID,
        email: email,
        groceryID: groceryID,
        pantryID: pantryID,
        relevantRecipesID: relevantRecipesID,
    }

    // create documents necessary for new users in firebase
    firebase.firestore().collection('users').doc(userID).set(userInfo)
    firebase.firestore().collection('relevantrecipes').doc(relevantRecipesID).set({
        userID: userID
    })
    firebase.firestore().collection('pantrylists').doc(pantryID).set({
        userID: userID
    }) 
    firebase.firestore().collection('grocerylists').doc(groceryID).set({
        userID: userID
    }) 

    dispatch({
        type: LOGIN_SUCCESS,
        payload: userInfo
    });
}

/**
 * authenticationFailure is a function that dispatches the authentication
 * error to the redux store.
 * 
 * @param {function} dispatch: dispatch function for redux
 * @param {string} errorMessage: message describing the error
 * @param {string} email: the email of the user in question
 */
function authenticationFailure(dispatch, errorMessage, email) {
    dispatch({
        type: LOGIN_FAILURE,
        payload: errorMessage,
        email: email
    });
}