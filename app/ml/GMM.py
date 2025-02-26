import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.mixture import GaussianMixture
from sklearn.impute import SimpleImputer
import argparse

def drop_categorical_columns(df):
    categorical_vars = []
    for col in df.columns:
        if not pd.api.types.is_numeric_dtype(df[col]):
            categorical_vars.append(col)
    print("Dropping categorical columns:", categorical_vars)
    return df.drop(columns=categorical_vars, axis=1)

def preprocess_data(data):
    # Initialize imputer for handling missing values
    imputer = SimpleImputer(strategy='mean')
    
    # Impute missing values
    imputed_data = imputer.fit_transform(data)
    
    # Scale the imputed data
    scaler = StandardScaler()
    scaled_data = scaler.fit_transform(imputed_data)
    
    return scaled_data, scaler

def select_best_component(data, max_components=5):
    bic = []
    for n in range(1, max_components + 1):
        gmm = GaussianMixture(n_components=n, covariance_type='full', random_state=42,
                             reg_covar=1e-6, n_init=10)
        gmm.fit(data)
        bic.append(gmm.bic(data))
    return np.argmin(bic) + 1

def generate_synthetic_data(input_path, output_path, n_samples):
    # Read input data
    data = pd.read_csv(input_path)
    
    # Drop categorical columns
    numeric_data = drop_categorical_columns(data)
    
    # Handle missing values and scale the data
    scaled_data, scaler = preprocess_data(numeric_data)
    
    # Find optimal number of components
    best_n = select_best_component(scaled_data)
    print(f"Optimal number of components selected: {best_n}")
    
    # Train GMM model
    gmm = GaussianMixture(n_components=best_n, random_state=42, covariance_type='full',
                         reg_covar=1e-6, n_init=10)
    gmm.fit(scaled_data)
    
    # Generate synthetic samples
    synthetic_samples, _ = gmm.sample(n_samples=n_samples)
    
    # Inverse transform the scaled data
    synthetic_data = scaler.inverse_transform(synthetic_samples)
    
    # Create DataFrame with original column names
    synthetic_df = pd.DataFrame(synthetic_data, columns=numeric_data.columns)
    
    # Save synthetic data
    synthetic_df.to_csv(output_path, index=False)
    print(f"Synthetic data saved to {output_path}")
    print(f"Generated {n_samples} synthetic samples")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Generate synthetic data using GMM')
    parser.add_argument('--input', type=str, required=True, help='Input CSV file path')
    parser.add_argument('--output', type=str, required=True, help='Output CSV file path')
    parser.add_argument('--samples', type=int, required=True, help='Number of synthetic samples to generate')
    
    args = parser.parse_args()
    generate_synthetic_data(args.input, args.output, args.samples) 