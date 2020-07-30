import os
import numpy as np
import pandas as pd
import argparse
from sqlalchemy import create_engine
from sklearn.manifold import TSNE

from model import RobustCov, LOF, IsoForest

def infer_dtype(data):
    if pd.to_numeric(data, errors='coerce').notnull().all():
        if np.array_equal(data, data.astype(int)):
            return 'discrete'
        else:
            return 'continuous'
    else:
        return 'discrete'

def get_features(df):
    features = [{'feature': feature} for feature in df.columns]
    for feature in features:
        feature['dtype'] = infer_dtype(df[feature['feature']])
    return pd.DataFrame(features)

def get_projection(df):
    tsne = TSNE(n_components=2)
    X = tsne.fit_transform(df)
    projection = pd.DataFrame(X).rename(columns={0: 'x', 1: 'y'})
    return projection

def config(file, connect_string, table, models=[RobustCov, LOF, IsoForest]):
    """
    :param connect_string: existing db ('postgresql://bmontambault@localhost:5432/pixal')
    :param table: new table ('breast_cancer')
    :param models: list of anomaly detection model classes
    """
    dir_path = os.path.dirname(os.path.realpath(__file__))
    df = pd.read_csv(f'{dir_path}/{file}')
    features_df = get_features(df)
    projection_df = get_projection(df)
    for model in models:
        m = model()
        m.fit(df)
        score = m.score(df)
        df[model.__name__.lower()] = score
    engine = create_engine(connect_string)
    df.to_sql(table, engine, if_exists='replace', index=False)
    features_df.to_sql(table + "_features", engine, if_exists='replace', index=False)
    projection_df.to_sql(table + "_projection", engine, if_exists='replace', index=False)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('connect_string')
    parser.add_argument('table')
    parser.add_argument('file')
    args = parser.parse_args()

    connect_string = args.connect_string
    table = args.table
    file = args.file
    config(file, connect_string, table)

