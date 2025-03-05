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
  // TODO: Implement your model selection logic here
  return {
    model: "Default Model",
    explanation: "Default model selected for data synthesis."
  };
};

export const generateSyntheticData = async (file: File, numSamples: number): Promise<any> => {
  try {
    console.log('Starting synthetic data generation...', { numSamples });
    console.log('File:', file.name, 'Size:', file.size);
    
    const formData = new FormData();
    const blob = new Blob([file], { type: file.type });
    formData.append('file', blob, file.name);
    formData.append('numSamples', numSamples.toString());

    console.log('Sending request to generate endpoint with sample size:', numSamples);
    const response = await fetch('/api/generate', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const responseData = await response.json();
      console.error('Error response from server:', responseData);
      throw new Error(
        responseData.details || 
        responseData.error || 
        'Failed to generate synthetic data'
      );
    }

    // Get the synthetic data file from the public directory
    const syntheticDataResponse = await fetch('/dataset_SYNTHETIC.csv');
    if (!syntheticDataResponse.ok) {
      throw new Error('Failed to fetch synthetic data file');
    }

    const syntheticDataBlob = await syntheticDataResponse.blob();
    
    // Add generation to history
    const timestamp = new Date().toISOString();
    const generatedDataset = {
      id: Date.now(),
      name: `synthetic_${file.name}`,
      originalDataset: file.name,
      uploadTime: timestamp,
      generationDuration: '1-2 minutes', // You can calculate actual duration if needed
      sampleCount: numSamples,
      timestamp: new Date().toLocaleString(),
      syntheticData: await syntheticDataBlob.text()
    };

    // Get existing datasets from localStorage
    const existingDatasets = JSON.parse(localStorage.getItem('generatedDatasets') || '[]');
    existingDatasets.push(generatedDataset);
    localStorage.setItem('generatedDatasets', JSON.stringify(existingDatasets));
    
    console.log('Successfully generated synthetic data');
    return {
      success: true,
      data: syntheticDataBlob,
      visualizations: {
        distributions: '/distributions.png',
        correlations: '/correlation_matrix.png',
        bic_aic: '/bic_aic_plot.png'
      }
    };
  } catch (error) {
    console.error('Error in generateSyntheticData:', error);
    throw error;
  }
};