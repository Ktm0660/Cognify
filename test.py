import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("firebase_key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

user_docs = db.collection('users').stream()

for user in user_docs:
    user_id = user.id
    try:
        print(f"\n🧠 Checking user: {user_id}")
        pattern_collection = db.collection('users').document(user_id).collection('patternGuessing').stream()
        
        found_any = False
        for doc in pattern_collection:
            found_any = True
            print(f"  📄 Found doc: {doc.id}")
            print(f"  📦 Data: {doc.to_dict()}")

        if not found_any:
            print("  🚫 No patternGuessing docs found.")

    except Exception as e:
        print(f"⚠️ Error for user {user_id}: {e}")
