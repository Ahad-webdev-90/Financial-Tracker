from pymongo import MongoClient

url = 'mongodb+srv://abbulahad105789:abbulahad105789@financetracker.ltg6n.mongodb.net/'
client = MongoClient(url)



db = client['FinanceTracker']