import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd

# STEP 1: Load credentials and initialize Firebase
cred = credentials.Certificate("firebase_key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# STEP 2: Pull all users
user_docs = db.collection('users').stream()
all_data = []

# STEP 3: Loop through users
for user in user_docs:
    user_id = user.id
    user_data = user.to_dict()

    try:
        pattern_collection = db.collection('users').document(user_id).collection('patternGuessingGame').stream()
        for doc in pattern_collection:
            print(f"User {user_id} → Found game doc: {doc.id}")
    except Exception as e:
        print(f"Error accessing patternGuessingGame for {user_id}: {e}")

    # (Optional placeholder if you want to eventually pull game data again)
    combined_data = {**user_data, 'user_id': user_id}
    all_data.append(combined_data)

# STEP 4: Save only if data exists
if all_data:
    df = pd.DataFrame(all_data)
    print(df.head())
    df.to_csv("firebase_game_data.csv", index=False)
    print("Saved to firebase_game_data.csv")
else:
    print("No data found!")
