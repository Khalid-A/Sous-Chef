export const CLEAR_PANTRY = "CLEAR_PANTRY";
export const ADD_PANTRY = "ADD_PANTRY";
export const ADD_NEW_PANTRY_ITEM = "ADD_NEW_PANTRY_ITEM";

import firebase from 'react-native-firebase';

/**
 * pantryRef Firestore collection reference to all pantry lists.
 */
const pantryRef = firebase.firestore().collection("pantrylists");
const ingredientsRef = firebase.firestore().collection("IDToIngredient");
const ingredientsIDLookupRef = firebase.firestore().collection("ingredientToID");

/**
 * beginPantryFetch Creates a listener that updates the current user's
 * pantry list as updates are made to it.
 * @param {string} userid The ID of the currently logged in user
 */
export const beginPantryFetch = (userid) => async dispatch => {
    pantryRef.where("userID", "=", userid).onSnapshot(pantryListSnapshot => {
        if (pantryListSnapshot.docs.length == 0) {
            return;
        }
        pantryListSnapshot.docs[0].ref.collection(
            "ingredients"
        ).onSnapshot(snapshot => {
            var index;
            for (index = 0; index < snapshot.docs.length; index++) {
                if (index == 0) {
                    dispatch({
                        type: CLEAR_PANTRY
                    });
                }
                var amount = snapshot.docs[index].get("amount");
                var unit = snapshot.docs[index].get("unit");
                var callback = ((amount, unit) => (ingredientSnapshot) => {
                    dispatch({
                        type: ADD_PANTRY,
                        payload: {
                            title: ingredientSnapshot.get("name"),
                            amount: amount,
                            unit: unit
                        }
                    });
                })(amount, unit);

                ingredientsRef.doc(
                    snapshot.docs[index].id
                ).get().then(callback);
            }
        })
    })
}

export const addPantryItem = (name, amount, unit, userid) => {
    ingredientsIDLookupRef.doc(name).get().then(snapshot => {
        var itemID;
        if (!snapshot.exists) {
            var newIngredient = ingredientsRef.doc();
            newIngredient.set({name: name});
            ingredientsIDLookupRef.doc(name).set({id: newIngredient.id});
            itemID = newIngredient.id;
        } else {
            itemID = snapshot.get("id");
            console.warn(itemID);
        }
        pantryRef.where("userID", "=", userid).onSnapshot(pantryListSnapshot => {
            pantryListSnapshot.docs[0].ref.collection(
                "ingredients"
            ).doc(itemID).set({amount: amount, unit: unit});
        });
    })
}