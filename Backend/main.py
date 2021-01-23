from flask import Flask, jsonify
from pymongo import MongoClient
import private
import json 

app = Flask(__name__)
client = MongoClient("mongodb+srv://"+private.user+":"+private.passw+"@cluster0.upbuw.mongodb.net/<dbname>?retryWrites=true&w=majority")
db = client.admin
state_data = client['HospitalAbridged']['state_data']



temp = state_data.find()
states = {}
for i in temp:
  states = i

states.pop("_id")
print(states)

# website.com <- index.html  d 
@app.route("/home")
def load_init():
  return jsonify(states)
 
# @app.route("/test")
# def test():
#   return "test successful"

@app.route('/')
def hello_world():
  return 'Hello, World!'










