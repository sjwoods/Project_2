
import numpy as np
from datetime import datetime as dt
import pandas as pd
import json
from pandas import DataFrame
from flask import Flask, jsonify 
from flask import request
from flask_cors import CORS

# Import our pymongo library, which lets us connect our Flask app to our Mongo database.
import pymongo

# Create an instance of our Flask app.
app = Flask(__name__)


app.config['SECRET_KEY'] = 'the quick brown fox jumps over the lazy   dog'
app.config['CORS_HEADERS'] = 'Content-Type'

#astrix removes the dependency of the program on the local host location
cors = CORS(app, resources={r"/*": {"origins": "*"}})

# Create connection variable
conn = 'mongodb://localhost:27017'

# Pass connection to the pymongo instance.
client = pymongo.MongoClient(conn)

# Connect to a database. Will create one if not already available.
db = client.COVID_19

    
# Flask Routes
@app.route("/")
def welcome():
   
    return (
        f"/api/covid_cases"
        f"/api/covid_cases/state/"
        f"/api/covid_cases/date/>"
        f"/api/LHS_Sales/state"
        f"/api/LHS_Sales/USA/>"                 
    )

@app.route("/api/covid_cases")
def covid_cases():
     # Store the entire covid  cases collection in a list
     covid_cases_df = DataFrame(list(db.US_COVID_cases.find({},{ "_id": 0 })))
     covid_cases_df=covid_cases_df.groupby(['Date'])['Confirmed','Deaths'].sum().reset_index()
     d = covid_cases_df.to_json(orient='records')
     data = json.loads(d)
     #print(data)
    
    # print(covid_cases)
    # Return the template with the teams list passed in
    #return render_template('index.html', teams=teams)
     return jsonify(data)
     
@app.route("/api/covid_cases/state/")
def covid_cases__state_args():
     state = request.args.get('name')
     # Store the entire covid  cases collection in a list
     covid_cases_df = DataFrame(list(db.US_COVID_cases.find({"Province/State":state},{ "_id": 0 })))
     covid_cases_df=covid_cases_df.groupby(['Date'])['Confirmed','Deaths'].sum().reset_index()
     d = covid_cases_df.to_json(orient='records')
     data = json.loads(d)
     return jsonify(data)

@app.route("/api/covid_cases/date/")
def covid_cases_day_args():
     day = request.args.get('day')
     # Store the entire covid  cases collection in a list
     covid_cases_df = DataFrame(list(db.US_COVID_cases.find({"Date":day},{ "_id": 0 })))
     covid_cases_df=covid_cases_df.groupby(['Province/State','latitude','longitude'])['Confirmed','Deaths'].sum().reset_index()
     d = covid_cases_df.to_json(orient='records')
     data = json.loads(d)
     return jsonify(data)
@app.route("/api/covid_cases/latest/")
def covid_cases_latest_args():
     state = request.args.get('state')
     # Store the entire covid  cases collection in a list
    
     if state=="USA":
        covid_cases_df = DataFrame(list(db.US_COVID_cases.find({"Date":"2020-04-10"},{ "_id": 0 })))
        covid_cases_df=covid_cases_df.groupby(['Date'])['Confirmed','Deaths'].sum().reset_index()
     else:
        covid_cases_df = DataFrame(list(db.US_COVID_cases.find({"Date":"2020-04-10","Province/State":state},{ "_id": 0 })))
        #covid_cases_df=covid_cases_df.groupby(['Province/State'])['Confirmed','Deaths'].sum().reset_index()
        
     d = covid_cases_df.to_json(orient='records')
     data = json.loads(d)
     return jsonify(data)
     
     
@app.route("/api/LHS_Sales/state/")
def LHSsales_wk_args():
     state = request.args.get('state')+ " "
     # Store the entire LHS collection in a list
     LHS_df = DataFrame(list(db.Handsoap_sales.find({"Province/State":state},{ "_id": 0 })))
     if LHS_df.shape[0]>0:
        LHS_df['Week Ending'] = pd.to_datetime(LHS_df['Week Ending'])
        LHS_df = LHS_df.sort_values(by='Week Ending')
     d = LHS_df.to_json(orient='records')
     data = json.loads(d)
     return jsonify(data)

@app.route("/api/LHS_Sales/USA")
def LHSsales_wk1__args():
     # state = request.args.get('state')
     # Store the entire LHS collection in a list
     LHS_df = DataFrame(list(db.Handsoap_sales.find({},{ "_id": 0 })))
     LHS_df=LHS_df.groupby(['Week Ending'])['Unit Sales'].sum().reset_index()
     LHS_df['Week Ending'] = pd.to_datetime(LHS_df['Week Ending'])
     LHS_df = LHS_df.sort_values(by='Week Ending')
     #df['DOB'] = pd.to_datetime(df.DOB)
     d = LHS_df.to_json(orient='records')
     data = json.loads(d)
     return jsonify(data)
@app.route("/api/covid_cases/top/")
def covid_cases_top_args():
     tp = request.args.get('type')
     day= request.args.get('day')
     # Store the entire covid  cases collection in a list
     covid_cases_df = DataFrame(list(db.US_COVID_cases.find({"Date":day},{ "_id": 0 })))
     if tp=="deaths":
        covid_cases_df=covid_cases_df.nlargest(10,['Deaths'])
     else:
       covid_cases_df=covid_cases_df.nlargest(10,['Confirmed'])
       
        
     d = covid_cases_df.to_json(orient='records')
     data = json.loads(d)
     return jsonify(data)
     
# Define Main Behavior
if __name__ == '__main__':
    app.run(debug=True)
    
    

