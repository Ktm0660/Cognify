import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd

# Initialize Firebase
cred = credentials.Certificate("firebase_key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Get all users
user_docs = db.collection('users').stream()

# Game result data
game_results = []

for user in user_docs:
    user_id = user.id

    try:
        # Look for result doc inside patternGuessingGame
        result_ref = db.collection('users').document(user_id).collection('patternGuessingGame').document('result')
        result_doc = result_ref.get()

        if result_doc.exists:
            result_data = result_doc.to_dict()
            result_data['user_id'] = user_id  # so we can merge later
            game_results.append(result_data)
            print(f"✅ Got result for {user_id}")
        else:
            print(f"🚫 No result for {user_id}")

    except Exception as e:
        print(f"⚠️ Error for {user_id}: {e}")

# Convert to DataFrame and save
if game_results:
    game_df = pd.DataFrame(game_results)
    print(game_df.head())
    game_df.to_csv("game_results.csv", index=False)
    print("Saved to game_results.csv")
else:
    print("No game results found.")
