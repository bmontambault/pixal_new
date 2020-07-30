from sqlalchemy import create_engine
import pandas as pd
import numpy as np

def get_predicate_data(model, predicate, connect_string, table):
    engine = create_engine(connect_string)
    predicate_data = []
    for feature in predicate.feature_values.keys():
        features_str = f'{model},{feature}'
        where = predicate.query(exclude=feature)
        if where == "":
            query = f"select {features_str} from {table}"
        else:
            query = f"select {features_str} from {table} where {where}"
        df = pd.read_sql(query, engine)
        df['anomaly'] = 1 - predicate.contains(df, features=[feature])
        predicate_data.append({'x': feature, 'y': model.lower(), 'data': df[[feature, model.lower(), 'anomaly']].to_dict('records')})

    return predicate_data

def infer_dtype(data):
    if pd.to_numeric(data, errors='coerce').notnull().all():
        if np.array_equal(data, data.astype(int)):
            return 'discrete'
        else:
            return 'continuous'
    else:
        return 'discrete'

def get_feature_dtypes(connect_string, table):
    engine = create_engine(connect_string)
    data = pd.read_sql(f"select * from {table} limit 1000", engine)
    feature_dtypes = {col: infer_dtype(data[col]) for col in data.columns}
    return feature_dtypes