from flask import Flask, jsonify
from pymongo import MongoClient
import private
import json

states = state_data.json

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










