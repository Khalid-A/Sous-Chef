import firebase_admin
from firebase_admin import credentials, firestore
import os, json 

cred = credentials.Certificate('./serviceaccountkey.json')
default_app = firebase_admin.initialize_app(cred)

db = firestore.client()

# with open ('./recipes.json') as f:
#     data = json.load(f)
#     for key in data.keys():
#         doc_ref = db.collection(u'recipes').document(key)
#         doc_ref.set(data[key])
        
path_to_json = './recipes/'
for recipe_file in os.listdir(path_to_json):
    if recipe_file.endswith('.json'):
        with open(path_to_json + recipe_file) as f:
            data = json.load(f)
            doc_ref = db.collection(u'recipes').document(data['id'])
            doc_ref.set(data)
        print(recipe_file)
