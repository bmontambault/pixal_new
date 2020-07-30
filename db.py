from sqlalchemy import create_engine
import pandas as pd
import numpy as np

def get_feature_dtypes(connect_string, table):
    engine = create_engine(connect_string)
    df = pd.read_sql(f"select feature,dtype from {table}_features", engine)
    features = df.set_index('feature')['dtype'].to_dict()
    return features

def get_projection(connect_string, table):
    engine = create_engine(connect_string)
    df = pd.read_sql(f"select * from {table}_projection", engine).reset_index()
    projection = df.to_dict('records')
    return projection

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
        df['anomaly'] = predicate.contains(df, features=[feature])
        predicate_data.append({'x': feature, 'y': model.lower(), 'data': df[[feature, model.lower(), 'anomaly']].to_dict('records')})
    return predicate_data