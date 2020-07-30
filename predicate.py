import numpy as np
import pandas as pd

class Predicate(object):

    def __init__(self, feature_values, feature_dtypes, index):
        self.feature_values = feature_values
        self.feature_dtypes = feature_dtypes
        self.index=index

    def contains(self, df, features=None):
        does_contain = np.ones(shape=df.shape[0])
        if features is None:
            features = self.feature_values.keys()
        for k in features:
            v = self.feature_values[k]
            dtype = self.feature_dtypes[k]
            if dtype == 'continuous':
                does_contain *= ((df[k] >= v[0]) & (df[k] <= v[1])).astype(int)
            elif dtype == "discrete":
                does_contain *= np.in1d(df[k], v).astype(int)
        return does_contain

    def cont_query(self, feature, values):
        return f"({feature} >= {values[0]} and {feature} <= {values[1]})"

    def disc_query(self, feature, values):
        if len(values) == 1:
            return f"{feature} = {values[0]}"
        else:
            return f"{feature} in {tuple(values)}"

    def feature_query(self, feature, values, dtype):
        if dtype == "continuous":
            return self.cont_query(feature, values)
        elif dtype == "discrete":
            return self.disc_query(feature, values)

    def query(self, exclude=[]):
        q = []
        for feature, values in self.feature_values.items():
            if feature not in exclude:
                q.append(self.feature_query(feature, values, self.feature_dtypes[feature]))
        return " and ".join(q)