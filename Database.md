# Database Architecture
This documents describes the data layout of our tables in Firebase. This document should be updated if the data in Firebase will be restructured.

<span style="color:lightgreen"> Green objects are collections. <span>
<span style="color:lightblue"> Blue objects are fields <span>

## users
This table stores all IDs associated with a particular user along with the user's email address.<br>
Document1 is indexed by <span style="color:pink">userID<span>.
| Document1 | Document1.data |
| --------- | --------------------------------------------- |
| 'userID'  | <span style="color:lightblue"> email: 'exampleEmail@stanford.edu' <br> groceryID: 'gID' <br> pantryID: 'pID' <br> relevantRecipesID: 'rrID' <br> userID: 'userID' </span>

## relevantrecipes 
This table stores information about which recipes are to be associated with a specific user.<br>
Document1 is indexed by <span style="color:pink">userID</span>. <br>
Document2 is indexed by <span style="color:pink">recipeID</span>.
| Document1 | Document1.data | Document2 | Document2.data |
| --------- | -------------- | --------- | ---------------|
| 'userID'  | <span style="color:lightblue">userID: 'exampleID'</span>
| | <br> <span style="color:lightgreen"> recipes <span> | 'recipeID' | <span style="color:lightblue">recipeID: 'rID'</span> <br> <span style="color:lightblue">isReadyToGo: 'true'</span>  <br> <span style="color:lightblue">isRecent: 'true'</span> <br>
| | | 'recipeID2' | <span style="color:lightblue">recipeID: 'rID2'</span> <br> <span style="color:lightblue">isReadyToGo: 'true'</span>  <br> <span style="color:lightblue">isRecent: 'true'</span> <br>


## recipes
This table stores the information relevant to a specific ingredient. <br>
Document1 is indexed by <span style="color:pink">recipeID</span>.
| Document1   | Document1.data |
| ----------- | -------------- |
| 'recipeID'  | <span style="color:lightblue">title: 'warm milk'<br>directions: ['put milk in cup', 'microwave cup']  <br>id: 'recipeID' <br>images: 'image.jpeg' <br>ingredients: {<br> &emsp;'ingredientid': {<br>&emsp;&emsp;ingredient: 'milk'<br>&emsp;&emsp;descriptions: ['cold', 'skim']<br>&emsp;&emsp;quantity: 2<br>&emsp;&emsp;unit: 'cups'<br>&emsp;} <br>}    </span> 

## groceryLists / pantryLists
These tables store information about which ingredients are stored in each user's lists.<br>
Document1 is indexed by <span style="color:pink">userID</span>. <br>
Document2 is indexed by <span style="color:pink">ingredientID</span>.
| Document1 | Document1.data | Document2 | Document2.data |
| --------- | -------------- | --------- | ---------------|
| 'userID'  | <span style="color:lightblue">userID: 'exampleID'</span>
| | <br> <span style="color:lightgreen"> ingredients <span> | 'ingrID' | <span style="color:lightblue">ingrID: 'ingrID'</span> <br> <span style="color:lightblue">quantity: '2'</span>  <br> <span style="color:lightblue">unit: 'grams'</span> <br>
| | | 'ingrID2' | <span style="color:lightblue">ingrID: 'ingrID2'</span> <br> <span style="color:lightblue">quantity: '10'</span>  <br> <span style="color:lightblue">unit: ''</span> <br>

## IDToIngredient 
This table maps ingredient IDs to ingredient names. <br>
Document1 is indexed by <span style="color:pink">ingredientID</span>
| Document1 | Document1.data |
| --------- | -------------- |
| 'ingrID'  | <span style="color:lightblue">name: 'milk'<br></span> 
| 'ingrID2' | <span style="color:lightblue">name: 'chicken'<br></span> 

## ingredientToID
This table maps ingredient names to ingredient ID. <br>
Document1 is indexed by <span style="color:pink">ingredientName</span>
| Document1 | Document1.data |
| --------- | -------------- |
| 'milk'    | <span style="color:lightblue">id: 'ingrID'<br></span> 
| 'chicken' | <span style="color:lightblue">id: 'ingrID2'<br></span> 