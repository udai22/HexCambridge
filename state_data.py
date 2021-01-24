from pymongo import MongoClient
import us
import private
import json 

client = MongoClient("mongodb+srv://"+private.user+":"+private.passw+"@cluster0.upbuw.mongodb.net/<dbname>?retryWrites=true&w=majority")
db = client.admin

# Test querying, returns json object
data = client['HospitalAbridged']['Data']
res = data.find_one({'state': 'PR'})
# prints hospital bed ratio, index into JSON object like a list

states = us.states.mapping('abbr', 'name').keys()

# get hospital bed capacity for each state
def create_hos_capacity():
    acc = {}
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
          if icu_b_total_acc == 0:
            avg_icu = 0
          else:
            avg_icu = int((icu_b_used_acc / icu_b_total_acc) * 100)
            
          if reg_b_total_acc != 0:
            avg_reg = int((reg_b_used_acc / reg_b_total_acc) * 100)
          else:
            avg_reg = 0 
          acc[s] = {'avg_icu': avg_icu, 'avg_reg': avg_reg}
    return acc

states_data = create_hos_capacity()
with open('state_data.json', 'w') as outfile:
    json.dump(states_data, outfile)
