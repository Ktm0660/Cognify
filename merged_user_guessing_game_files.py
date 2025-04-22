import pandas as pd

# Load both files
user_df = pd.read_csv("firebase_game_data.csv")
game_df = pd.read_csv("game_results.csv")

# Merge on user_id
combined_df = pd.merge(user_df, game_df, on="user_id", how="inner")

# Save to new file
combined_df.to_csv("combined_user_game_data.csv", index=False)
print("✅ Combined data saved to combined_user_game_data.csv")
print(combined_df.head())


import pandas as pd
import ast

# Load the merged dataset
df = pd.read_csv("combined_user_game_data.csv")

# --- Cleanup Starts Here ---

# 1. Convert time fields from ms to readable formats
# 1. Convert time fields from ms to readable formats
if "timeSpentCorrect" in df.columns:
    df["timeSpentCorrect"] = pd.to_numeric(df["timeSpentCorrect"], errors="coerce")
    df["timeSpentCorrect_sec"] = df["timeSpentCorrect"] / 1000
    df["timeSpentCorrect_min"] = df["timeSpentCorrect_sec"] / 60

if "timeSpentIncorrect" in df.columns:
    df["timeSpentIncorrect"] = pd.to_numeric(df["timeSpentIncorrect"], errors="coerce")
    df["timeSpentIncorrect_sec"] = df["timeSpentIncorrect"] / 1000
    df["timeSpentIncorrect_min"] = df["timeSpentIncorrect_sec"] / 60

# 2. Convert completedAt to readable datetime
if "completedAt" in df.columns:
    df["completedAt"] = pd.to_datetime(df["completedAt"], errors="coerce")
    df["completedDate"] = df["completedAt"].dt.date
    df["completedTime"] = df["completedAt"].dt.time
    df["completedHour"] = df["completedAt"].dt.hour

# 3. Convert all list-like fields (e.g., correctList, incorrectList, answers)
list_fields = ["correctList", "incorrectList", "answers"]

for field in list_fields:
    if field in df.columns:
        df[f"{field}_count"] = df[field].apply(
            lambda x: len(ast.literal_eval(x)) if pd.notnull(x) and isinstance(x, str) else 0
        )
        df[f"{field}_str"] = df[field].astype(str)

# 4. Time per guess and accuracy
if "guessCount" in df.columns and "timeSpentCorrect_sec" in df.columns:
    df["avgTimePerGuess_sec"] = df["timeSpentCorrect_sec"] / df["guessCount"]

if "correctList_count" in df.columns and "incorrectList_count" in df.columns:
    df["accuracyRate"] = df["correctList_count"] / (
        df["correctList_count"] + df["incorrectList_count"]
    )

# --- Save cleaned file ---
df.to_csv("cleaned_user_game_data.csv", index=False)
print("✅ Cleaned data saved as cleaned_user_game_data.csv")
print(df.head())
