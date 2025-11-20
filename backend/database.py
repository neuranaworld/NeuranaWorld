from pymongo import MongoClient
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class Database:
    client: Optional[MongoClient] = None
    db = None

    @classmethod
    def initialize(cls):
        mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017/neuramath")
        cls.client = MongoClient(mongo_url)
        cls.db = cls.client.get_database()
        print(f"✅ MongoDB connected: {cls.db.name}")
        
        # Create indexes
        cls.db.users.create_index("email", unique=True, sparse=True)
        cls.db.questions.create_index(["subject", "category", "difficulty"])
        cls.db.llm_cache.create_index("question_hash")
        cls.db.user_progress.create_index(["user_id", "subject", "category"])

    @classmethod
    def get_db(cls):
        if cls.db is None:
            cls.initialize()
        return cls.db

    @classmethod
    def close(cls):
        if cls.client:
            cls.client.close()
