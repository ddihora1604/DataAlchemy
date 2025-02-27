import os
import numpy as np 
import pandas as pd  
import seaborn as sns
from scipy.stats import ks_2samp
import matplotlib.pyplot as plt 
from sklearn.mixture import GaussianMixture
from sklearn.preprocessing import MinMaxScaler
from sklearn.cluster import KMeans
import argparse

# ================= IDENTIFY FEATURE TYPES ================================
def identify_feature_types(data, discrete_threshold=0.05, max_unique=10):
    continuous_features, discrete_features = [], []
    for column in data.columns:
        if not pd.api.types.is_numeric_dtype(data[column]) or data[column].dtype == 'bool':
            discrete_features.append(column)
        else:
            unique_values = data[column].nunique()
            unique_ratio = unique_values / len(data)
            if unique_ratio < discrete_threshold or unique_values <= max_unique:
                discrete_features.append(column)
            else:
                continuous_features.append(column)
    return continuous_features, discrete_features
# ========================================================================

# ================= DETECT MODALITY ======================================
def detect_modality(data, feature, bins=50):
    """Detects if a feature is multimodal by analyzing its histogram."""
    
    # Drop columns where more than 90% of values are NaN
    data = data.dropna(thresh=int(0.1 * len(data)), axis=1)
    
    # Check if the feature still exists after dropping NaN-heavy columns
    if feature not in data.columns:
        print(f"Skipping '{feature}' as it was removed due to excessive NaNs.")
        return False, 1  # Treat as unimodal
    
    # Drop NaNs in the current feature
    feature_data = data[feature].dropna()
    
    # If the column is empty or has less than 2 values, return single mode
    if feature_data.empty or len(feature_data) < 2:
        print(f"Skipping modality detection for '{feature}' due to insufficient data.")
        return False, 1  # Treat as unimodal
    
    # Compute histogram only if valid data exists
    hist, bin_edges = np.histogram(feature_data, bins=bins)
    
    # Detect peaks in the histogram
    peaks = []
    for i in range(1, len(hist) - 1):
        if hist[i] > hist[i - 1] and hist[i] > hist[i + 1]:
            peaks.append((bin_edges[i], hist[i]))
    
    # Determine if multimodal based on significant peaks
    if len(peaks) > 2:
        max_height = max(hist)
        significant_peaks = [p for p in peaks if p[1] > 0.2 * max_height]
        if len(significant_peaks) >= 2:
            return True, len(significant_peaks)
    
    return False, 1  # Default: Treat as unimodal
# ========================================================================

# ================= SELECTING BEST COMPONENT BASED ON BIC ======================================
def select_best_component(data, max_components=10, plot=True, public_dir=None):
    bic_scores = []
    aic_scores = []
    for n in range(1, max_components + 1):
        gmm = GaussianMixture(n_components=n, covariance_type='full', 
                             random_state=42, reg_covar=1e-6, n_init=10)
        gmm.fit(data)
        bic_scores.append(gmm.bic(data))
        aic_scores.append(gmm.aic(data))
    # if plot and public_dir:
    #     plt.figure(figsize=(10, 6))
    #     plt.plot(range(1, max_components + 1), bic_scores, label='BIC', marker = 'o')
    #     plt.plot(range(1, max_components + 1), aic_scores, label='AIC', marker = 's')
    #     plt.xlabel('Number of components', fontsize = 14)
    #     plt.ylabel('Score', fontsize = 14)
    #     plt.legend(fontsize=12)
    #     plt.title('BIC and AIC scores for different numbers of components', fontsize=16)
    #     plt.grid(True, linestyle='--', alpha=0.6)
    #     plt.savefig(os.path.join(public_dir, 'bic_aic_plot.png'), dpi=300, bbox_inches='tight', pad_inches=0.2)
    #     plt.close()
    return np.argmin(bic_scores) + 1
# ========================================================================

# ================= GENERATE DISCRETE DATA ======================================
def generate_synthetic_discrete(data, features, n_samples=1000, smoothing=0.01):
    if len(features) == 0:
        return pd.DataFrame(index=range(n_samples))
    synthetic_discrete = pd.DataFrame(index=range(n_samples))
    for col in features:
        val_counts = data[col].value_counts(normalize=True)
        if val_counts.empty:
            print(f"Warning: No values found for column {col}, using default value")
            synthetic_discrete[col] = "Unknown"
            continue
            
        if smoothing > 0:
            val_counts = (val_counts + smoothing) / (1 + smoothing * len(val_counts))
        synthetic_discrete[col] = np.random.choice(
            val_counts.index, 
            size=n_samples, 
            p=val_counts.values
        )
        if pd.api.types.is_numeric_dtype(data[col]):
            synthetic_discrete[col] = synthetic_discrete[col].astype(data[col].dtype)
    return synthetic_discrete
# ========================================================================

# ================= GENERATE CONTINUOS DATA ======================================
def generate_synthetic_continuous(data, features, n_samples=1000, model_type='gmm'):
    if len(features) == 0:
        return pd.DataFrame(index=range(n_samples))

    # Drop rows with NaN values before scaling
    clean_data = data[features].dropna()

    if clean_data.empty:
        print(f"Warning: No valid data available for continuous features: {features}")
        return pd.DataFrame(index=range(n_samples), columns=features)

    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(clean_data)

    multimodal_features = {}
    for feature in features:
        is_multimodal, n_modes = detect_modality(clean_data, feature)
        if is_multimodal:
            multimodal_features[feature] = n_modes

    if multimodal_features:
        print(f"Detected multimodal features: {multimodal_features}")

    if model_type == 'gmm':
        best_n = select_best_component(scaled_data)
        print(f"Selected {best_n} components for GMM")

        gmm = GaussianMixture(n_components=best_n, random_state=42, 
                              covariance_type='full', reg_covar=1e-6, n_init=10)
        gmm.fit(scaled_data)
        synthetic_samples = gmm.sample(n_samples=n_samples)[0]

    elif model_type == 'cluster_gmm':
        best_n = select_best_component(scaled_data)
        n_clusters = min(5, len(clean_data) // 100)

        kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        clusters = kmeans.fit_predict(scaled_data)

        synthetic_clusters = []
        for cluster_id in range(n_clusters):
            cluster_data = scaled_data[clusters == cluster_id]
            cluster_size = len(cluster_data)

            if cluster_size > 0:
                cluster_samples = int(n_samples * (cluster_size / len(scaled_data)))
                if cluster_samples > 0 and cluster_size > 1:
                    n_components = min(3, max(1, cluster_size // 30))
                    gmm = GaussianMixture(n_components=n_components, random_state=42,
                                          covariance_type='full', reg_covar=1e-6, n_init=10)
                    gmm.fit(cluster_data)
                    cluster_synthetic = gmm.sample(n_samples=cluster_samples)[0]
                    synthetic_clusters.append(cluster_synthetic)

        if synthetic_clusters:
            synthetic_samples = np.vstack(synthetic_clusters)
        else:
            gmm = GaussianMixture(n_components=min(3, len(scaled_data) // 100),
                                  random_state=42, covariance_type='full',
                                  reg_covar=1e-6, n_init=10)
            gmm.fit(scaled_data)
            synthetic_samples = gmm.sample(n_samples=n_samples)[0]

        if len(synthetic_samples) < n_samples:
            remaining = n_samples - len(synthetic_samples)
            gmm = GaussianMixture(n_components=best_n, random_state=43,
                                  covariance_type='full', reg_covar=1e-6, n_init=10)
            gmm.fit(scaled_data)
            extra_samples = gmm.sample(n_samples=remaining)[0]
            synthetic_samples = np.vstack([synthetic_samples, extra_samples])

    synthetic_continuous = pd.DataFrame(
        scaler.inverse_transform(synthetic_samples),
        columns=features
    )
    return synthetic_continuous
# ========================================================================

# ========================== PRESERVE FEATURE CORRELATIONS ==============================================
def preserve_feature_correlations(cont_df, disc_df, original_data, strength=0.5):
    result_df = cont_df.copy()
    
    for col in disc_df.columns:
        result_df[col] = disc_df[col].values
    
    for disc_col in disc_df.columns:
        if not pd.api.types.is_numeric_dtype(original_data[disc_col]):
            continue
            
        unique_values = original_data[disc_col].unique()
        
        for value in unique_values:
            synth_mask = result_df[disc_col] == value
            orig_mask = original_data[disc_col] == value
            
            if orig_mask.sum() == 0 or synth_mask.sum() == 0:
                continue
                
            for cont_col in cont_df.columns:
                orig_cond_mean = original_data.loc[orig_mask, cont_col].mean()
                orig_cond_std = original_data.loc[orig_mask, cont_col].std()
                
                if np.isnan(orig_cond_std) or orig_cond_std == 0:
                    continue
                
                synth_mean = result_df.loc[synth_mask, cont_col].mean()
                synth_std = result_df.loc[synth_mask, cont_col].std()
                
                if np.isnan(synth_std) or synth_std == 0:
                    continue
                
                std_values = (result_df.loc[synth_mask, cont_col] - synth_mean) / synth_std
                adjusted_values = (std_values * orig_cond_std) + orig_cond_mean
                
                result_df.loc[synth_mask, cont_col] = (
                    (1 - strength) * result_df.loc[synth_mask, cont_col] + 
                    strength * adjusted_values
                )
    
    return result_df
# ===================================================================================

# ========================== ENFORCE CONSTRAINTS ==============================================
def enforce_constraints(df, constraints=None):
    # First enforce value ranges
    if constraints is None:
        # Default to dataset's own min/max if no constraints provided
        for col in df.columns:
            if pd.api.types.is_numeric_dtype(df[col]):
                df[col] = df[col].clip(lower=df[col].min(), upper=df[col].max())
    else:
        # Use provided constraints (typically from original data)
        for col, (min_val, max_val) in constraints.items():
            if col in df.columns and pd.api.types.is_numeric_dtype(df[col]):
                df[col] = df[col].clip(lower=min_val, upper=max_val)
    
    # Then handle -0.0 values
    for col in df.columns:
        if pd.api.types.is_numeric_dtype(df[col]):
            # Convert -0.0 to 0.0 using vectorized operation
            df[col] = np.where(df[col].eq(-0.0), 0.0, df[col])
    
    return df
# =====================================================================================

# ========================== EVALUATE SYNTHETIC DATA ==============================================
def evaluate_synthetic_data(real_df, synthetic_df, discrete_features=None, public_dir=None):
    features = real_df.columns
    num_features = len(features)
    ncols = 3
    nrows = (num_features + ncols - 1) // ncols
    
    plt.figure(figsize=(ncols * 8, nrows * 6))
    for idx, feature in enumerate(features):
        plt.subplot(nrows, ncols, idx + 1)
        
        is_discrete = (discrete_features and feature in discrete_features) or \
                      not pd.api.types.is_numeric_dtype(real_df[feature])
        
        if is_discrete:
            real_counts = real_df[feature].value_counts(normalize=True).nlargest(10)
            synth_counts = synthetic_df[feature].value_counts(normalize=True)
            
            top_values = list(real_counts.index)
            x = np.arange(len(top_values))
            width = 0.35
            
            plt.bar(x - width / 2, 
                    [real_counts.get(idx, 0) for idx in top_values], 
                    width, label='Original', alpha=0.7)
            plt.bar(x + width / 2, 
                    [synth_counts.get(idx, 0) for idx in top_values], 
                    width, label='Synthetic', alpha=0.7)
            
            plt.xticks(x, top_values, rotation=45, ha='right')
            plt.title(f'Top Values for {feature}', fontsize=14)
        else:
            try:
                sns.kdeplot(data=real_df, x=feature, label='Original', 
                            color='blue', fill=True, alpha=0.5)
                sns.kdeplot(data=synthetic_df, x=feature, label='Synthetic', 
                            color='orange', fill=True, alpha=0.5)
                plt.title(f'KDE of {feature}', fontsize=14)
            except (TypeError, ValueError) as e:
                plt.text(0.5, 0.5, f"Cannot plot {feature}: {str(e)}", 
                         ha='center', va='center', transform=plt.gca().transAxes)
                plt.axis('off')
        
        plt.legend(fontsize=12)
        plt.grid(False)
    
    plt.tight_layout()
    if public_dir:
        plt.savefig(os.path.join(public_dir, 'distributions.png'), dpi=300, bbox_inches='tight', pad_inches=0.2)
    plt.close()
    
    numeric_cols = [col for col in real_df.columns if pd.api.types.is_numeric_dtype(real_df[col])]
    corr_metrics = None
    
    if numeric_cols:
        real_corr = real_df[numeric_cols].corr()
        synth_corr = synthetic_df[numeric_cols].corr()
        corr_diff = np.abs(real_corr - synth_corr)
        max_diff = corr_diff.max().max()
        avg_diff = corr_diff.mean().mean()
        corr_metrics = {'max_diff': max_diff, 'avg_diff': avg_diff}
        
        if len(numeric_cols) < 7:
            plt.figure(figsize=(18, 6))
            plt.suptitle(f"Max Difference: {max_diff:.4f}, Average Difference: {avg_diff:.4f}", fontsize=16, y=1.02)
            
            plt.subplot(131)
            sns.heatmap(real_corr, annot=False, cmap='coolwarm', cbar=True)
            plt.title('Original Data Correlation', fontsize=14)
            
            plt.subplot(132)
            sns.heatmap(synth_corr, annot=False, cmap='coolwarm', cbar=True)
            plt.title('Synthetic Data Correlation', fontsize=14)
            
            plt.subplot(133)
            sns.heatmap(corr_diff, annot=False, cmap='viridis', cbar=True)
            plt.title('Absolute Correlation Difference', fontsize=14)
            
            plt.tight_layout()
            if public_dir:
                plt.savefig(os.path.join(public_dir, 'correlation_matrix.png'), dpi=300, bbox_inches='tight', pad_inches=0.2)
            plt.close()
            
            print(f"Max correlation difference: {corr_diff.max().max():.4f}")
            print(f"Average correlation difference: {corr_diff.mean().mean():.4f}")
        else:
            print(f"Skipping correlation plot for {len(numeric_cols)} columns (too many)")
    
    ks_results = {}
    for col in real_df.columns:
        if col not in discrete_features and pd.api.types.is_numeric_dtype(real_df[col]):
            statistic, p_value = ks_2samp(real_df[col], synthetic_df[col])
            ks_results[col] = {"KS statistic": statistic, "p-value": p_value}
    
    if corr_metrics:
        print("\nCorrelation Differences:")
        print(f"Maximum: {corr_metrics['max_diff']:.4f}")
        print(f"Average: {corr_metrics['avg_diff']:.4f}")
    
    return ks_results

# ==========================================================================


# ========================== GENERATE SYNTHETIC DATA ==============================================
def generate_synthetic_data(data, n_samples=1000, preserve_correlations=True, 
                          discrete_threshold=0.05, model_type='gmm', public_dir=None):
    continuous_features, discrete_features = identify_feature_types(
        data, discrete_threshold=discrete_threshold
    )
    
    continuous_features = [col for col in continuous_features if pd.api.types.is_numeric_dtype(data[col])]
    remaining_columns = set(data.columns) - set(continuous_features)
    discrete_features = list(remaining_columns)
    
    synthetic_continuous = generate_synthetic_continuous(
        data, continuous_features, n_samples=n_samples, model_type=model_type
    )
    
    synthetic_discrete = generate_synthetic_discrete(
        data, discrete_features, n_samples=n_samples
    )
    
    if preserve_correlations and continuous_features and discrete_features:
        synthetic_df = preserve_feature_correlations(
            synthetic_continuous, synthetic_discrete, data
        )
    else:
        synthetic_df = pd.concat([synthetic_continuous, synthetic_discrete], axis=1)
    
    original_constraints = {
        col: (data[col].min(), data[col].max())
        for col in data.columns
        if pd.api.types.is_numeric_dtype(data[col])
    }
    
    synthetic_df = enforce_constraints(synthetic_df, constraints=original_constraints)
    
    ks_results = evaluate_synthetic_data(data, synthetic_df, discrete_features, public_dir)
    
    return synthetic_df, ks_results
# ========================================================================

# ============================= DETECTING DECIMAL PLACES OF COLUMNS =======================
def detect_decimal_places(series):
    """Returns the max number of decimal places found in a column."""
    decimals = series.astype(str).str.split('.').str[-1]  
    decimals = decimals[decimals.str.isnumeric()]
    return decimals.str.len().max() or 0  
# ==================================================================================

# =========================== MAIN FUNCTION (ENTRY POINT)=======================
def main():
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Generate synthetic data using GMM')
    parser.add_argument('--input', type=str, required=True, help='Input CSV file path')
    parser.add_argument('--samples', type=int, required=True, help='Number of samples to generate')
    parser.add_argument('--public_dir', type=str, required=True, help='Public directory for saving visualizations')
    
    args = parser.parse_args()
    
    try:
        # Check if input file exists
        if not os.path.exists(args.input):
            raise FileNotFoundError(f"Input file not found: {args.input}")
            
        print(f"Reading data from: {args.input}")
        print(f"Will generate {args.samples} samples")
        data = pd.read_csv(args.input)
        
        print("Generating synthetic data...")
        synthetic_data, quality_metrics = generate_synthetic_data(
            data, n_samples=args.samples, model_type='gmm', public_dir=args.public_dir
        )
        
        print("Processing generated data...")
        # Identify numeric columns
        numeric_cols = synthetic_data.select_dtypes(include=['number']).columns
        
        # Function to detect if a column should be integer
        def is_integer_column(series):
            return series.dropna().apply(lambda x: isinstance(x, (int, float)) and float(x).is_integer()).all()
        
        # Split columns into integer and float based on original data
        integer_cols = [col for col in numeric_cols if is_integer_column(data[col])]
        float_cols = [col for col in numeric_cols if col not in integer_cols]
        
        # Get decimal places for float columns
        decimal_places = {col: detect_decimal_places(data[col]) for col in float_cols}
        
        # Round float columns while keeping integer columns as whole numbers
        for col, places in decimal_places.items():
            synthetic_data[col] = synthetic_data[col].round(places)
        
        # Convert integer columns back to int
        for col in integer_cols:
            synthetic_data[col] = synthetic_data[col].astype(int)
        
        # Save cleaned synthetic dataset
        name, _ = os.path.splitext(os.path.basename(args.input))
        output_path = os.path.join(args.public_dir, f'{name}_SYNTHETIC.csv')
        synthetic_data.to_csv(output_path, index=False)
        print(f"Synthetic data saved to: {output_path}")
        
    except Exception as e:
        print(f"Error: {str(e)}")
        raise

if __name__ == "__main__":
    main()
