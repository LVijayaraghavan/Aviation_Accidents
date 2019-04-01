import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session, sessionmaker, scoped_session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify
from datetime import datetime , timedelta,date
import time
import datetime as dt
#from flask_optional_routes import OptionalRoutes

#from config import sqluser,sqlpassword,dbport,dburi,dbname
from flask import Flask, render_template, redirect,make_response
from flask_table import Table, Col

from flask_sqlalchemy import SQLAlchemy
import numpy as np



#################################################
# Database Setup
#################################################

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///db/aviation_accidents.sqlite"

db = SQLAlchemy(app)


# engine = create_engine("sqlite:///db/aviation_accidents.db")
# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)
print(Base.classes.keys())
# Save reference to the table
Hist_accidents = Base.classes.Historical_accidents
Hist_summary=Base.classes.Historical_summary
Cause_count=Base.classes.Count_by_causes

# Create our session (link) from Python to the DB
session = scoped_session(sessionmaker(db.engine))



@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r
    
@app.route("/Hist")
def names():
    """Return a list of sample names."""
    # sel = [
    #     Hist_summary.Year
    # ]
    # Use Pandas to perform the sql query
    results = db.session.query(Hist_summary.Year).all()
   
    all_years=list(np.ravel(results))
    Years = [ int(x) for x in all_years]
    return(jsonify(Years))


@app.route("/accidents/<Year>")
def Accidents_inYear(Year):
    #print(Year)
    """Return the MetaData for a given sample."""
    sel = [
        Hist_accidents.Date,
        Hist_accidents.Location,
        Hist_accidents.Operator,
        Hist_accidents.Aboard,
        Hist_accidents.Fatalities,
        Hist_accidents.Ground,
        Hist_accidents.Type,
        Hist_accidents.Summary,
        Hist_accidents.Year
    ]

    results = db.session.query(*sel).filter(Hist_accidents.Year == Year).all()
    #print(results)
    # Create a dictionary entry for each row of metadata information
    Historical_metadata = []

    for result in results:
        Hist_metadata={}
        # Year = func.extract('year', result[0]).label('Year')
        # print(Year)
        print(result[0].strftime("%m-%d-%Y"))
        Hist_metadata["Date"] = result[0].strftime("%h-%d")
        Hist_metadata["Location"] = result[1]
        Hist_metadata["Aboard"] = result[3]
        Hist_metadata["Fatalities"] = result[4]
        Hist_metadata["Operator"] = result[2]
        Hist_metadata["Type"] = result[6]
        Hist_metadata["Summary"] = result[7]
        Historical_metadata.append(Hist_metadata)

    #print(Historical_metadata)
    return jsonify(Historical_metadata)

@app.route('/Data_summ/')
def data_summ():
    return render_template('Data_summ.html')

@app.route('/accident/cause')
def cause_count():
   
    results = db.session.query(Cause_count.Cause).all()
    Reasons=list(np.ravel(results))
    return (jsonify(Reasons))

if __name__ == "__main__":
    app.run()
