# database.py
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
mongo_uri = os.getenv("MONGO_URI")

if not mongo_uri:
    logger.error("MONGO_URI environment variable not set!")
    raise ValueError("MONGO_URI environment variable not set!")

# Create MongoDB client
try:
    client = MongoClient(mongo_uri)
    # Test connection
    client.server_info()
    logger.info("Connected to MongoDB successfully")
    
    # Initialize database and collection
    db = client.my_database
    collection = db.tasks
    
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {e}")
    raise