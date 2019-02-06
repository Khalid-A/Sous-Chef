export const SET_NAME = "SET_NAME";
export const ADD_RECIPE = "ADD_RECIPE";

export function setName(name) {
    return { type: SET_NAME, text: name };
}

export function addRecipe(recipe) {
  return { type: ADD_RECIPE, payload: recipe};
}
