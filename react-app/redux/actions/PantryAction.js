export const CLEAR_PANTRY = "CLEAR_PANTRY";
export const ADD_PANTRY = "ADD_PANTRY";
export const ADD_NEW_PANTRY_ITEM = "ADD_NEW_PANTRY_ITEM";
export const SET_INGREDIENTS_TO_REMOVE = "SET_INGREDIENTS_TO_REMOVE";

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
    pantryRef.doc(userid).onSnapshot(pantryListSnapshot => {
        pantryListSnapshot.ref.collection(
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
        var ingredientID;
        if (!snapshot.exists) {
            var newIngredient = ingredientsRef.doc();
            newIngredient.set({name: name});
            ingredientsIDLookupRef.doc(name).set({id: newIngredient.id});
            ingredientID = newIngredient.id;
        } else {
            ingredientID = snapshot.get("id");
            console.warn(ingredientID);
        }
        pantryRef.doc(userid).onSnapshot(pantryListSnapshot => {
            pantryListSnapshot.ref.collection(
                "ingredients"
            ).doc(ingredientID).set({amount: amount, unit: unit});
        });
    })
}

/**
 * setIngredientsToRemove function that listens on finished
 * page to get ingredients to remove from the pantry
 */
export const setIngredientsToRemove = (ingredients) => {
  return {
    type: SET_INGREDIENTS_TO_REMOVE,
    payload: ingredients,
  };
}
