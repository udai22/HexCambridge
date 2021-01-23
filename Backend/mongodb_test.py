from pymongo import MongoClient
from pprint import pprint
import json
import us
from flask import Flask

client = MongoClient(
    "mongodb+srv://sunil_sabnis:2nhZXrfu5Eiv5mFw@cluster0.upbuw.mongodb.net/<dbname>?retryWrites=true&w=majority")
db = client.admin

# Test querying, returns json object
data = client['HospitalAbridged']['Data']
res = data.find_one({'state': 'PR'})
# prints hospital bed ratio, index into JSON object like a list

states = us.states.mapping('abbr', 'name').keys()

# get hospital bed capacity for each state


def create_hos_capacity():
    acc = []
    for s in states:
        h_lst = data.find({'state': s})
        if h_lst != None:
            icu_b_used_acc = 0
            icu_b_total_acc = 0
            reg_b_used_acc = 0
            reg_b_total_acc = 0
            for h in h_lst:
                icu_b_used_acc += float(h["icu_beds_used_7_day_avg"])
                icu_b_total_acc += float(h["total_icu_beds_7_day_avg"])
                reg_b_used_acc += float(
                    h["all_adult_hospital_inpatient_bed_occupied_7_day_avg"])
                reg_b_total_acc += float(
                    h["all_adult_hospital_beds_7_day_avg"])
            avg_icu = int((icu_b_used_acc / icu_b_total_acc) * 100)
            avg_reg = int((reg_b_used_acc / reg_b_total_acc) * 100)
            acc.append({'state': s, 'avg_icu': avg_icu, 'avg_reg': avg_reg})
    return acc
