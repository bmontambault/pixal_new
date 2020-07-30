from flask import Flask, render_template, request
import os
import json
import pandas as pd
import pickle

from predicate import Predicate
from db import get_feature_dtypes, get_predicate_data

connect_string = 'postgresql://bmontambault@localhost:5432/pixal'
table = 'breast_cancer'

app = Flask(__name__)
app.secret_key = ''
app.config['SESSION_TYPE'] = 'filesystem'
path = os.path.dirname(os.path.realpath(__file__))

@app.route('/')
def index():
    feature_dtypes = get_feature_dtypes(connect_string, table)
    features = list(feature_dtypes.keys())
    return render_template('index.html', features=features, feature_dtypes=feature_dtypes)

@app.route('/get_predicates', methods=['GET', 'POST'])
def get_predicates():
    request_data = request.get_json(force=True)
    models = request_data['models']
    features = request_data['features']
    specificity = request_data['specificity']

    predicates = [Predicate({'radius_mean': [.4, .5]}, {'radius_mean': 'continuous'})]
    predicate_data = [a for b in [get_predicate_data(models, predicate, connect_string, table) for predicate in predicates] for a in b]
    return json.dumps(predicate_data)

if __name__ == "__main__":
    app.run(debug=True)