"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  ScatterChart, 
  Scatter,
  ReferenceLine
} from 'recharts'
import { useData } from "@/contexts/data-context"
import Papa from 'papaparse'
import { 
  mean, 
  median, 
  mode, 
  standardDeviation, 
  variance, 
  min, 
  max,
  quantile 
} from 'simple-statistics'
import { useState, useEffect } from 'react'

const demoData = {
  distributions: Array.from({ length: 50 }, (_, i) => ({
    x: i,
    original: Math.sin(i * 0.5) * 10 + 50 + Math.random() * 5,
    synthetic: Math.sin(i * 0.5) * 10 + 50 + Math.random() * 5,
  })),
  statistics: {
    original: {
      mean: 50.2,
      median: 49.8,
      stdDev: 7.3,
      min: 35.4,
      max: 65.1,
      ksTest: 0.95,
      adTest: 0.92,
      chiSquare: 0.89,
      statSimilarity: 0.94,
      privacyScore: 0.88,
      correlationScore: 0.91,
      mlUtility: 0.93,
      dataDiversity: 0.87,
      outlierScore: 0.90
    },
    synthetic: {
      mean: 50.5,
      median: 50.1,
      stdDev: 7.1,
      min: 36.2,
      max: 64.8,
      ksTest: 0.93,
      adTest: 0.90,
      chiSquare: 0.87,
      statSimilarity: 0.92,
      privacyScore: 0.89,
      correlationScore: 0.90,
      mlUtility: 0.91,
      dataDiversity: 0.88,
      outlierScore: 0.89
    }
  },
  correlations: Array.from({ length: 20 }, () => ({
    feature1: Math.random() * 10,
    feature2: Math.random() * 10,
    originalCorr: Math.random(),
    syntheticCorr: Math.random()
  }))
}

const defaultAxisProps = {
  stroke: 'hsl(var(--muted-foreground))',
  strokeWidth: 1,
  fontSize: 12,
  tickLine: false,
  axisLine: true,
  tickFormatter: (value: number) => value.toString()
}

const calculateAverage = (values: number[]) => {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
};

const calculateCorrelation = (array1: number[], array2: number[]) => {
  if (array1.length !== array2.length || array1.length === 0) return 0;

  try {
    const mean1 = calculateAverage(array1);
    const mean2 = calculateAverage(array2);
    
    const variance1 = array1.reduce((a, b) => a + Math.pow(b - mean1, 2), 0);
    const variance2 = array2.reduce((a, b) => a + Math.pow(b - mean2, 2), 0);
    
    if (variance1 === 0 || variance2 === 0) return 0;
    
    const covariance = array1.reduce((a, b, i) => a + (b - mean1) * (array2[i] - mean2), 0);
    
    return covariance / Math.sqrt(variance1 * variance2);
  } catch (error) {
    console.error('Error calculating correlation:', error);
    return 0;
  }
};

const calculateStatistics = (data: number[]) => {
  try {
    const cleanData = data.filter(val => !isNaN(val));
    if (cleanData.length === 0) return null;

    return {
      mean: mean(cleanData),
      median: median(cleanData),
      stdDev: standardDeviation(cleanData),
      min: min(cleanData),
      max: max(cleanData),
      q1: quantile(cleanData, 0.25),
      q3: quantile(cleanData, 0.75),
      sampleSize: cleanData.length,
      variance: variance(cleanData)
    };
  } catch (error) {
    console.error('Error calculating statistics:', error);
    return null;
  }
};

const calculateSimilarityScore = (original: number[], synthetic: number[]) => {
  try {
    // Calculate KS test statistic (simplified version)
    const originalSorted = [...original].sort((a, b) => a - b);
    const syntheticSorted = [...synthetic].sort((a, b) => a - b);
    
    let maxDiff = 0;
    for (let i = 0; i < originalSorted.length; i++) {
      const diff = Math.abs(
        originalSorted[i] / Math.max(...originalSorted) - 
        syntheticSorted[i] / Math.max(...syntheticSorted)
      );
      maxDiff = Math.max(maxDiff, diff);
    }
    
    return 1 - maxDiff; // Convert to similarity score
  } catch (error) {
    console.error('Error calculating similarity score:', error);
    return 0;
  }
};

const calculateStatisticalTests = (original: number[], synthetic: number[]) => {
  try {
    if (!original?.length || !synthetic?.length) return null;

    // Calculate KS test statistic (simplified)
    const ksTest = () => {
      const origCdf = original.sort((a, b) => a - b)
        .map((_, i) => i / original.length);
      const synthCdf = synthetic.sort((a, b) => a - b)
        .map((_, i) => i / synthetic.length);
      
      const maxDiff = Math.max(
        ...origCdf.map((v, i) => Math.abs(v - (synthCdf[i] || 0)))
      );
      
      return 1 - maxDiff;
    };

    // Calculate statistical similarity
    const calculateSimilarity = () => {
      const origStats = calculateStatistics(original);
      const synthStats = calculateStatistics(synthetic);
      
      if (!origStats || !synthStats) return 0;

      const meanDiff = Math.abs(origStats.mean - synthStats.mean) / Math.abs(origStats.mean);
      const stdDiff = Math.abs(origStats.stdDev - synthStats.stdDev) / Math.abs(origStats.stdDev);
      
      return 1 - (meanDiff + stdDiff) / 2;
    };

    return {
      ksTest: ksTest(),
      statSimilarity: calculateSimilarity(),
      correlationScore: Math.abs(calculateCorrelation(original, synthetic))
    };
  } catch (error) {
    console.error('Error calculating statistical tests:', error);
    return null;
  }
};

export default function Analysis() {
  const { dataset, generatedData } = useData()

  // Add state for visualization data
  const [visualizationData, setVisualizationData] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState('');

  useEffect(() => {
    if (dataset?.columns?.length > 0 && !selectedColumn) {
      setSelectedColumn(dataset.columns[0]);
    }
  }, [dataset]);

  useEffect(() => {
    const processData = async () => {
      if (dataset && generatedData) {
        const data = await processDataForVisualization();
        setVisualizationData(data);
      }
    };
    processData();
  }, [dataset, generatedData]);

  // Update the processDataForVisualization function
  const processDataForVisualization = async () => {
    if (!dataset || !generatedData) return null;

    try {
      // Ensure proper parsing of generated data
      let parsedGenerated: any[] = [];
      
      if (typeof generatedData === 'string') {
        const parseResult = Papa.parse(generatedData, { 
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true 
        });
        parsedGenerated = parseResult.data;
      } else if (generatedData instanceof Blob) {
        const text = await generatedData.text();
        const parseResult = Papa.parse(text, { 
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true 
        });
        parsedGenerated = parseResult.data;
      } else {
        parsedGenerated = Array.isArray(generatedData) ? generatedData : [generatedData];
      }

      // Validate parsed data
      if (!Array.isArray(parsedGenerated) || parsedGenerated.length === 0) {
        console.error('Invalid or empty generated data');
        return null;
      }

      // Calculate correlations between features
      const correlations = dataset.columns.flatMap((column1, i) => 
        dataset.columns.map((column2, j) => {
          if (i >= j) return null; // Skip duplicate calculations

          try {
            const original1 = dataset.data
              .map(row => parseFloat(row[i]))
              .filter(val => !isNaN(val));
            const original2 = dataset.data
              .map(row => parseFloat(row[j]))
              .filter(val => !isNaN(val));
            
            const synthetic1 = parsedGenerated
              .map(row => {
                if (!row) return NaN;
                const value = Array.isArray(row) ? row[i] : row[column1];
                return typeof value === 'number' ? value : parseFloat(value);
              })
              .filter(val => !isNaN(val));
            const synthetic2 = parsedGenerated
              .map(row => {
                if (!row) return NaN;
                const value = Array.isArray(row) ? row[j] : row[column2];
                return typeof value === 'number' ? value : parseFloat(value);
              })
              .filter(val => !isNaN(val));

            if (original1.length && original2.length && synthetic1.length && synthetic2.length) {
              return {
                feature1: column1,
                feature2: column2,
                originalCorr: calculateCorrelation(original1, original2),
                syntheticCorr: calculateCorrelation(synthetic1, synthetic2)
              };
            }
          } catch (error) {
            console.error(`Error calculating correlation for ${column1}-${column2}:`, error);
          }
          return null;
        }).filter(Boolean)
      );

      // Calculate statistics for each column
      const statistics = {
        original: {},
        synthetic: {}
      };

      dataset.columns.forEach((column, columnIndex) => {
        // Get original values
        const originalValues = dataset.data
          .map(row => parseFloat(row[columnIndex]))
          .filter(val => !isNaN(val));

        // Get synthetic values
        const syntheticValues = parsedGenerated
          .map((row: any) => {
            if (!row) return NaN;
            return Array.isArray(row) ? 
              parseFloat(row[columnIndex]) : 
              parseFloat(row[column]);
          })
          .filter(val => !isNaN(val));

        if (originalValues.length && syntheticValues.length) {
          const originalStats = calculateStatistics(originalValues);
          const syntheticStats = calculateStatistics(syntheticValues);
          const statTests = calculateStatisticalTests(originalValues, syntheticValues);

          if (originalStats && syntheticStats && statTests) {
            statistics.original[column] = {
              ...originalStats,
              ...statTests
            };
            statistics.synthetic[column] = {
              ...syntheticStats,
              ...statTests
            };
          }
        }
      });

      // Process the data and update state
      const processedData = {
        distributions: dataset.columns.flatMap((column, columnIndex) => {
          // Get original values
          const originalValues = dataset.data
            .map(row => parseFloat(row[columnIndex]))
            .filter(val => !isNaN(val));

          // Get synthetic values with better error handling
          const syntheticValues = parsedGenerated
            .map((row: any) => {
              if (!row) return NaN;
              if (Array.isArray(row)) {
                return parseFloat(row[columnIndex]);
              }
              return parseFloat(row[column]);
            })
            .filter(val => !isNaN(val));

          if (originalValues.length === 0 || syntheticValues.length === 0) {
            console.log(`No valid values for column ${column}`);
            return [];
          }

          // Calculate min and max for the range
          const minVal = Math.min(...originalValues, ...syntheticValues);
          const maxVal = Math.max(...originalValues, ...syntheticValues);
          
          // Create histogram bins
          const numBins = 20;
          const binWidth = (maxVal - minVal) / numBins;
          
          // Initialize bins
          const bins = Array.from({ length: numBins }, (_, i) => ({
            binStart: minVal + i * binWidth,
            binEnd: minVal + (i + 1) * binWidth,
            original: 0,
            synthetic: 0
          }));

          // Fill bins with better error handling
          originalValues.forEach(val => {
            if (typeof val === 'number' && !isNaN(val)) {
              const binIndex = Math.min(
                Math.floor((val - minVal) / binWidth),
                numBins - 1
              );
              if (binIndex >= 0 && binIndex < numBins) {
                bins[binIndex].original++;
              }
            }
          });

          syntheticValues.forEach(val => {
            if (typeof val === 'number' && !isNaN(val)) {
              const binIndex = Math.min(
                Math.floor((val - minVal) / binWidth),
                numBins - 1
              );
              if (binIndex >= 0 && binIndex < numBins) {
                bins[binIndex].synthetic++;
              }
            }
          });

          // Normalize frequencies
          const originalTotal = originalValues.length;
          const syntheticTotal = syntheticValues.length;

          return bins.map((bin, i) => ({
            column,
            x: bin.binStart.toFixed(2),
            xEnd: bin.binEnd.toFixed(2),
            original: originalTotal > 0 ? (bin.original / originalTotal) * 100 : 0,
            synthetic: syntheticTotal > 0 ? (bin.synthetic / syntheticTotal) * 100 : 0
          }));
        }),
        correlations,
        statistics
      };

      setVisualizationData(processedData);
      return processedData;
    } catch (error) {
      console.error('Error processing visualization data:', error);
      return null;
    }
  };

  // If no data is available, show a message
  if (!dataset || !generatedData) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Numerical Analysis</h2>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              Please generate synthetic data in the Dashboard first to view analysis
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Numerical Analysis</h2>
      </div>
      <Tabs defaultValue="statistics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
          <TabsTrigger value="distributions">Distributions</TabsTrigger>
          <TabsTrigger value="correlations">Correlations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="statistics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Original Data Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dataset?.columns.map(column => {
                    const stats = visualizationData?.statistics?.original[column];
                    return stats ? (
                      <div key={column} className="space-y-2">
                        <h4 className="font-medium">{column}</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Mean: {stats.mean?.toFixed(4)}</div>
                          <div>Median: {stats.median?.toFixed(4)}</div>
                          <div>Std Dev: {stats.stdDev?.toFixed(4)}</div>
                          <div>Variance: {stats.variance?.toFixed(4)}</div>
                          <div>Min: {stats.min?.toFixed(4)}</div>
                          <div>Max: {stats.max?.toFixed(4)}</div>
                          <div>Q1: {stats.q1?.toFixed(4)}</div>
                          <div>Q3: {stats.q3?.toFixed(4)}</div>
                          <div>Sample Size: {stats.sampleSize}</div>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Synthetic Data Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dataset?.columns.map(column => {
                    const stats = visualizationData?.statistics?.synthetic[column];
                    return stats ? (
                      <div key={column} className="space-y-2">
                        <h4 className="font-medium">{column}</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Mean: {stats.mean?.toFixed(4)}</div>
                          <div>Median: {stats.median?.toFixed(4)}</div>
                          <div>Std Dev: {stats.stdDev?.toFixed(4)}</div>
                          <div>Variance: {stats.variance?.toFixed(4)}</div>
                          <div>Min: {stats.min?.toFixed(4)}</div>
                          <div>Max: {stats.max?.toFixed(4)}</div>
                          <div>Q1: {stats.q1?.toFixed(4)}</div>
                          <div>Q3: {stats.q3?.toFixed(4)}</div>
                          <div>Sample Size: {stats.sampleSize}</div>
                        </div>
                        <div className="mt-2 pt-2 border-t grid grid-cols-2 gap-2 text-sm">
                          {/* <div>KS Test: {stats.ksTest?.toFixed(4)}</div> */}
                          {/* <div>Similarity: {stats.statSimilarity?.toFixed(4)}</div>
                          <div>Correlation: {stats.correlationScore?.toFixed(4)}</div> */}
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="visualizations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Data Distribution Comparison</CardTitle>
                <select 
                  className="mt-2 w-full rounded-md border p-2"
                  onChange={(e) => setSelectedColumn(e.target.value)}
                  value={selectedColumn}
                >
                  {dataset?.columns.map(column => (
                    <option key={column} value={column}>
                      {column}
                    </option>
                  ))}
                </select>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={
                        visualizationData?.distributions
                          ?.filter(d => d.column === selectedColumn) || []
                      }
                      margin={{ top: 20, right: 30, left: 60, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        {...defaultAxisProps}
                        dataKey="x"
                        label={{ 
                          value: `${selectedColumn} Value Range`, 
                          position: 'bottom',
                          offset: 20
                        }}
                        tickFormatter={(value) => parseFloat(value).toFixed(1)}
                      />
                      <YAxis 
                        {...defaultAxisProps}
                        label={{ 
                          value: 'Frequency (%)', 
                          angle: -90, 
                          position: 'left',
                          offset: 40
                        }}
                        tickFormatter={(value) => `${value.toFixed(1)}%`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))'
                        }}
                        formatter={(value: number) => [`${value.toFixed(2)}%`, 'Frequency']}
                        labelFormatter={(label) => `Range: ${label} - ${
                          visualizationData?.distributions?.find(d => d.x === label)?.xEnd
                        }`}
                      />
                      <Legend 
                        verticalAlign="top" 
                        height={36}
                      />
                      <Bar 
                        dataKey="original" 
                        fill="hsl(var(--chart-1))" 
                        name="Original Data"
                        opacity={0.8}
                      />
                      <Bar 
                        dataKey="synthetic" 
                        fill="hsl(var(--chart-2))" 
                        name="Synthetic Data"
                        opacity={0.8}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feature Correlation Scatter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis {...defaultAxisProps} dataKey="originalCorr" name="Original Correlation" />
                      <YAxis {...defaultAxisProps} dataKey="syntheticCorr" name="Synthetic Correlation" />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))'
                        }}
                      />
                      <Legend />
                      <Scatter 
                        name="Feature Correlations" 
                        data={visualizationData?.correlations || []} 
                        fill="hsl(var(--chart-1))" 
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distributions">
          <Card>
            <CardHeader>
              <CardTitle>Data Distribution Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={visualizationData?.distributions || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      {...defaultAxisProps} 
                      dataKey="x"
                      label={{ value: 'Value', position: 'bottom' }}
                    />
                    <YAxis 
                      {...defaultAxisProps}
                      label={{ value: 'Frequency', angle: -90, position: 'left' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="original" 
                      fill="hsl(var(--chart-1))" 
                      name="Original Data" 
                    />
                    <Bar 
                      dataKey="synthetic" 
                      fill="hsl(var(--chart-2))" 
                      name="Synthetic Data" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correlations">
          <Card>
            <CardHeader>
              <CardTitle>Feature Correlations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      {...defaultAxisProps} 
                      type="number"
                      dataKey="originalCorr"
                      name="Original Correlation"
                      domain={[-1, 1]}
                      label={{ 
                        value: 'Original Dataset Correlation', 
                        position: 'bottom',
                        offset: 20
                      }}
                      tickFormatter={(value) => value.toFixed(2)}
                    />
                    <YAxis 
                      {...defaultAxisProps}
                      type="number"
                      dataKey="syntheticCorr"
                      name="Synthetic Correlation"
                      domain={[-1, 1]}
                      label={{ 
                        value: 'Synthetic Dataset Correlation', 
                        angle: -90, 
                        position: 'left',
                        offset: 40
                      }}
                      tickFormatter={(value) => value.toFixed(2)}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))'
                      }}
                      formatter={(value: number, name: string) => [
                        value.toFixed(4),
                        name === 'originalCorr' ? 'Original Correlation' : 'Synthetic Correlation'
                      ]}
                      labelFormatter={(value) => {
                        const point = visualizationData?.correlations?.find(
                          (c: any) => c.originalCorr === value || c.syntheticCorr === value
                        );
                        return point ? `${point.feature1} vs ${point.feature2}` : '';
                      }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <ReferenceLine 
                      segment={[{ x: -1, y: -1 }, { x: 1, y: 1 }]}
                      stroke="hsl(var(--muted-foreground))"
                      strokeDasharray="3 3"
                      strokeOpacity={0.5}
                    />
                    <Scatter
                      data={visualizationData?.correlations || []}
                      fill="hsl(var(--chart-1))"
                      name="Feature Correlations"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}