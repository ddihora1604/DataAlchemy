import Papa from 'papaparse';

export interface DataStats {
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  ksTest: number;
  adTest: number;
  chiSquare: number;
  statSimilarity: number;
  privacyScore: number;
  correlationScore: number;
  mlUtility: number;
  dataDiversity: number;
  outlierScore: number;
}

export interface Dataset {
  data: any[][];
  columns: string[];
  stats: Record<string, DataStats>;
}

export const processCSV = (file: File): Promise<Dataset> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: function(results) {
        try {
          console.log("Parsing CSV results:", results);
          
          if (!results.data || !Array.isArray(results.data)) {
            throw new Error("Invalid CSV data structure");
          }

          // Extract column names from the first row
          const columns = Object.keys(results.data[0] || {});
          console.log("Extracted columns:", columns);

          if (!columns.length) {
            throw new Error("No columns found in CSV");
          }

          // Convert data to array format and remove header row
          const data = results.data.slice(1).map(row => {
            if (typeof row === 'object') {
              return columns.map(col => row[col]);
            }
            return [];
          });

          // Calculate statistics for each column
          const stats: Record<string, DataStats> = {};
          columns.forEach((col, idx) => {
            const values = data.map(row => parseFloat(row[idx])).filter(val => !isNaN(val));
            stats[col] = calculateStats(values);
          });

          resolve({ data, columns, stats });
        } catch (error) {
          console.error("Error processing CSV:", error);
          reject(error);
        }
      },
      header: true,
      dynamicTyping: true,
      error: (error) => {
        console.error("CSV parsing error:", error);
        reject(error);
      }
    });
  });
};

const calculateStats = (values: number[]): DataStats => {
  const sorted = [...values].sort((a, b) => a - b);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  const stdDev = Math.sqrt(
    values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length
  );

  // Simulate advanced statistical tests
  // In a production environment, these would be actual calculations
  const simulateScore = () => 0.85 + Math.random() * 0.1;

  return {
    mean,
    median,
    stdDev,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    ksTest: simulateScore(),
    adTest: simulateScore(),
    chiSquare: simulateScore(),
    statSimilarity: simulateScore(),
    privacyScore: simulateScore(),
    correlationScore: simulateScore(),
    mlUtility: simulateScore(),
    dataDiversity: simulateScore(),
    outlierScore: simulateScore()
  };
};

interface ModelChoice {
  model: string;
  explanation: string;
}

export const determineOptimalModel = async (dataset: Dataset): Promise<ModelChoice> => {
  // Analyze dataset characteristics
  const characteristics = analyzeDataset(dataset)
  
  if (characteristics.hasHighDimensionality && characteristics.hasContinuousData) {
    return {
      model: "Variational Autoencoder (VAE)",
      explanation: "VAE was selected due to high-dimensional continuous data, offering efficient dimensionality reduction and smooth interpolation capabilities."
    }
  } else if (characteristics.hasComplexRelationships && characteristics.hasMultipleTypes) {
    return {
      model: "Tabular GAN",
      explanation: "GAN was chosen for its ability to handle mixed data types and capture complex relationships between variables."
    }
  } else {
    return {
      model: "Copula-based Synthesis",
      explanation: "Copula-based synthesis was selected for its robust statistical properties and ability to preserve correlations in simpler datasets."
    }
  }
}

interface DataCharacteristics {
  hasHighDimensionality: boolean;
  hasContinuousData: boolean;
  hasComplexRelationships: boolean;
  hasMultipleTypes: boolean;
}

const analyzeDataset = (dataset: Dataset): DataCharacteristics => {
  // Get column count from the columns array
  const columnCount = dataset.columns.length
  
  // Get sample size from the data array
  const sampleSize = dataset.data.length
  
  // Count continuous columns by analyzing the data
  const continuousColumns = dataset.columns.filter((col, colIndex) => {
    // Get all values for this column
    const columnValues = dataset.data.map(row => row[colIndex])
    // Check if all non-null values are numbers
    return columnValues.every(value => 
      value === null || value === undefined || typeof value === 'number'
    )
  }).length
  
  const correlations = calculateCorrelations(dataset)
  
  return {
    hasHighDimensionality: columnCount > 10,
    hasContinuousData: continuousColumns / columnCount > 0.7,
    hasComplexRelationships: hasComplexCorrelations(correlations),
    hasMultipleTypes: continuousColumns < columnCount
  }
}

const calculateCorrelations = (dataset: Dataset): number[][] => {
  // Simplified correlation calculation
  // In a real implementation, this would do proper correlation analysis
  return [[1]]
}

const hasComplexCorrelations = (correlations: number[][]): boolean => {
  // Simplified complexity detection
  // In a real implementation, this would analyze correlation patterns
  return true
}

export const generateSyntheticData = async (dataset: Dataset, numSamples: number): Promise<string> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: dataset.data,
        columns: dataset.columns,
        numSamples: numSamples
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Failed to generate synthetic data');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error generating synthetic data:', error);
    throw error;
  }
};