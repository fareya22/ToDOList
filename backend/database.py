from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()
client = MongoClient(os.getenv("MONGO_URI"))
db = client.my_database
collection = db.tasks

# print("Connecting to URI:", collection)
# print("Connecting to database:", db.name) 
# Check if the connection is successful
try: 
    client.server_info()
    print("Connected to mongoDb successfully")
except Exception as e:
    print("Failed to connect to MongoDB:", e)