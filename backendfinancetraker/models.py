from db_connection import db
from datetime import datetime

# Collections
user_collection = db["users"]
entrie_collection = db["entries"]

class UserModel:
    def __init__(self, username, email, password, profileimage=None):
        self.username = username
        self.email = email
        self.password = password
        self.profileimage = profileimage
        self.entries = []
        self.created_at = datetime.now()
        self.updated_at = datetime.now()

    def save(self):
        user_collection.insert_one(self.__dict__)

class EntrieModel:
    def __init__(self, userId, entry_type, amount, category=None):
        self.userId = userId
        self.entry_type = entry_type  # 'income' or 'expense'
        self.amount = amount
        self.date = datetime.now().isoformat()
        self.category = category if entry_type == "expense" else None

    def save(self):
        entrie_collection.insert_one(self.__dict__)
