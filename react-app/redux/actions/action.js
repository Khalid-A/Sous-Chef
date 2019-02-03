export const SET_NAME = "SET_NAME"
export const SET_USER_ID = "SET_USER_ID"

export function setName(name) {
    return { type: SET_NAME, text: name }
}

export function setUserId(userId) {
    return { type: SET_USER_ID, text: userId }
}