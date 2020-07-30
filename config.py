import os
import pandas as pd
import argparse
from sqlalchemy import create_engine

from model import RobustCov, LOF, IsoForest

def config(file, connect_string, table, models=[RobustCov, LOF, IsoForest]):
    """
    :param connect_string: existing db ('postgresql://bmontambault@localhost:5432/pixal')
    :param table: new table ('breast_cancer')
    :param models: list of anomaly detection model classes
    """
    dir_path = os.path.dirname(os.path.realpath(__file__))
    df = pd.read_csv(f'{dir_path}/{file}')
    for model in models:
        m = model()
        m.fit(df)
        score = m.score(df)
        df[model.__name__.lower()] = score
    engine = create_engine(connect_string)
    df.to_sql(table, engine, if_exists='replace')

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

