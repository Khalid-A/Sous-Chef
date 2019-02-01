import { createStore } from "redux";
import sousChefApp from "./reducers/reducer";

const store = createStore(
    sousChefApp
);

export default store