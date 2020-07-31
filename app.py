from flask import Flask, render_template, request
import os
import json
import pandas as pd
import pickle

from predicate import Predicate
from db import get_feature_dtypes, get_projection, get_predicate_data

p1_index = [229,
 350,
 353,
 368,
 371,
 503,
 505,
 596,
 607,
 625,
 643,
 708,
 739,
 804,
 1010,
 1068,
 1093,
 1095,
 1097,
 1116,
 1166,
 1217,
 1242,
 1440,
 1615,
 1842,
 1860,
 1888,
 1930,
 2015,
 2018,
 2056,
 2062,
 2063,
 2218,
 2236,
 2263,
 2279,
 2378,
 2413,
 2474,
 2536,
 2707,
 2715,
 2911,
 2961,
 2963,
 3073,
 3292,
 3350,
 3492,
 3551,
 3560,
 3638,
 3681,
 3845,
 3916,
 3994,
 4087,
 4104,
 4148,
 4224,
 4235,
 4325,
 4332,
 4343,
 4541,
 4662,
 4945,
 5000,
 5001,
 5002,
 5003,
 5004,
 5005,
 5006,
 5007,
 5008,
 5009,
 5010,
 5011,
 5012,
 5013,
 5014,
 5015,
 5016,
 5017,
 5018,
 5020,
 5021,
 5022,
 5023,
 5024,
 5025,
 5026,
 5027,
 5028,
 5030,
 5032,
 5033,
 5034,
 5035,
 5036,
 5037,
 5038,
 5039,
 5040,
 5041,
 5042,
 5043,
 5044,
 5045,
 5046,
 5047,
 5048,
 5049,
 5050,
 5051,
 5052,
 5053,
 5054,
 5055,
 5056,
 5057,
 5058,
 5059,
 5060,
 5061,
 5062,
 5063,
 5064,
 5065,
 5066,
 5067,
 5068,
 5069,
 5070,
 5071,
 5072]
p2_index = [1344, 1634, 1678, 2054, 3170, 3814, 5019, 5029, 5031, 5073, 5074, 5075]


connect_string = 'postgresql://bmontambault@localhost:5432/pixal'
table = 'intel_sensor_s4'

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

    # predicates = [{'predicate': Predicate({'radius_mean': [.4, .5], 'radius_se': [.2, .3]},
    #                                       {'radius_mean': 'continuous', 'radius_se': 'continuous'},
    #                                       index=[0, 1, 2, 3]),
    #                'model': 'RobustCov'},
    #               {'predicate': Predicate({'texture_mean': [.7, .8], 'texture_se': [.4, .5], 'smoothness_mean': [.2, .3]},
    #                                       {'texture_mean': 'continuous', 'texture_se': 'continuous', 'smoothness_mean': 'continuous'},
    #                                       index=[5, 6, 7, 8, 100, 110, 120]),
    #                'model': 'LOF'}
    #               ]
    predicates = [{'predicate': Predicate({'temperature': [120, 123]}, {'temperature': 'continuous'}, index=p1_index), 'model': 'IsoForest'},
                  {'predicate': Predicate({'voltage': [2.27556, 2.34751]}, {'voltage': 'continuous'}, index=p1_index), 'model': 'LOF'},
                  {'predicate': Predicate({'temperature': [-40, -20]}, {'temperature': 'continuous'}, index=p2_index), 'model': 'RobustCov'},
                  {'predicate': Predicate({'dtime': ['2004-03-02 08:00:00', '2004-03-02 15:00:00'], 'moteid': [15]}, {'dtime': 'date', 'moteid': 'discrete'}, index=p1_index), 'model': 'RobustCov'}]
    predicate_index = {i: predicates[i]['predicate'].index for i in range(len(predicates))}
    predicate_features = {i: list(predicates[i]['predicate'].feature_values.keys()) for i in range(len(predicates))}
    predicate_data = [get_predicate_data(predicate['model'], predicate['predicate'], connect_string, table) for predicate in predicates]
    predicate_data = dict(zip(range(len(predicate_data)), predicate_data))
    return json.dumps({'predicate_data': predicate_data, 'predicate_index': predicate_index, 'predicate_features': predicate_features})

if __name__ == "__main__":
    app.run(debug=True)