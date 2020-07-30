from flask import Flask, render_template, request
import os
import json
import pandas as pd
import pickle

from predicate import Predicate
from db import get_feature_dtypes, get_projection, get_predicate_data

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
    projection = get_projection(connect_string, table)
    return render_template('index.html', features=features, feature_dtypes=feature_dtypes, projection=projection)

@app.route('/get_predicates', methods=['GET', 'POST'])
def get_predicates():
    request_data = request.get_json(force=True)
    models = request_data['models']
    features = request_data['features']
    specificity = request_data['specificity']

    predicates = [{'predicate': Predicate({'radius_mean': [.4, .5], 'radius_se': [.2, .3]},
                                          {'radius_mean': 'continuous', 'radius_se': 'continuous'},
                                          index=[0, 1, 2, 3]),
                   'model': 'RobustCov'},
                  {'predicate': Predicate({'texture_mean': [.7, .8], 'texture_se': [.4, .5], 'smoothness_mean': [.2, .3]},
                                          {'texture_mean': 'continuous', 'texture_se': 'continuous', 'smoothness_mean': 'continuous'},
                                          index=[5, 6, 7, 8, 100, 110, 120]),
                   'model': 'LOF'}
                  ]
    predicate_index = {i: predicates[i]['predicate'].index for i in range(len(predicates))}
    predicate_features = {i: list(predicates[i]['predicate'].feature_values.keys()) for i in range(len(predicates))}
    predicate_data = [get_predicate_data(predicate['model'], predicate['predicate'], connect_string, table) for predicate in predicates]
    predicate_data = dict(zip(range(len(predicate_data)), predicate_data))
    return json.dumps({'predicate_data': predicate_data, 'predicate_index': predicate_index, 'predicate_features': predicate_features})

if __name__ == "__main__":
    app.run(debug=True)