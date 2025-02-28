"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload, Download, FileUp, CheckCircle2, Shield, Settings2, Wand2 } from "lucide-react"
import { toast } from "sonner"
import { processCSV, type Dataset, determineOptimalModel, generateSyntheticData } from "@/lib/data-service"
import { useNotifications } from "@/contexts/notification-context"
import { UploadSuccessDialog } from "@/components/upload-success-dialog"
import Papa from "papaparse"
import { useData } from "@/contexts/data-context"

const UploadSuccessPopup = ({ fileName, isClosing }: { 
  fileName: string;
  isClosing: boolean;
}) => (
  <div className={`fixed bottom-4 right-4 ${isClosing ? 'animate-slide-down-fade' : 'animate-slide-up-fade'}`}>
    <div className="bg-card border shadow-lg rounded-lg p-4 max-w-md animate-scale-in">
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full success-ring" />
            <CheckCircle2 className="h-6 w-6 text-success animate-bounce-small" />
          </div>
        </div>
        
        <div className="space-y-1">
          <h4 className="font-medium">Upload Successful!</h4>
          <p className="text-sm text-muted-foreground">
            {fileName} is ready for generation
          </p>
        </div>
      </div>
    </div>
  </div>
);

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
  
  return `${size} ${sizes[i]}`;
};

const calculateColumnStats = (data: any[][], colIndex: number) => {
  // Extract column values
  const columnValues = data.map(row => row[colIndex]);
  
  // Count missing values (null, undefined, empty string, or NaN)
  const missingCount = columnValues.filter(val => 
    val === null || 
    val === undefined || 
    val === '' || 
    (typeof val === 'number' && isNaN(val))
  ).length - 1;
  
  // Get non-null values for further processing
  const nonNullValues = columnValues.filter(val => 
    val !== null && 
    val !== undefined && 
    val !== '' && 
    !(typeof val === 'number' && isNaN(val))
  );
  
  // Count unique values (excluding missing values)
  const uniqueValues = new Set(nonNullValues);
  
  // Calculate completeness percentage
  const completeness = ((columnValues.length - missingCount) / columnValues.length) * 100;

  // Calculate numeric statistics if applicable
  let numericStats = null;
  if (nonNullValues.length > 0 && nonNullValues.every(val => !isNaN(Number(val)))) {
    const numbers = nonNullValues.map(v => Number(v));
    const sum = numbers.reduce((a, b) => a + b, 0);
    const mean = sum / numbers.length;
    const sortedNums = [...numbers].sort((a, b) => a - b);
    
    numericStats = {
      min: sortedNums[0],
      max: sortedNums[sortedNums.length - 1],
      mean: mean,
      median: sortedNums[Math.floor(sortedNums.length / 2)]
    };
  }

  return {
    uniqueCount: uniqueValues.size,
    missingCount,
    completeness,
    numericStats
  };
};

// Update the DatasetParameters component
const DatasetParameters = ({ dataset, file }: { dataset: Dataset, file: File }) => (
  <Card className="col-span-2 mb-6">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <FileUp className="h-5 w-5 text-primary" />
        Dataset Overview
      </CardTitle>
      <CardDescription>
        Detailed analysis of your uploaded dataset
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      {/* File Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">File Name</p>
          <p className="font-medium truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground mt-1">CSV Format</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Rows</p>
          <p className="font-medium">{dataset.data.length.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">Records</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Columns</p>
          <p className="font-medium">{dataset.columns.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Features</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">File Size</p>
          <p className="font-medium">{formatFileSize(file.size)}</p>
          <p className="text-xs text-muted-foreground mt-1">Original Size</p>
        </div>
      </div>

      {/* Column Analysis */}
      <div>
        <h4 className="text-sm font-medium mb-3">Column Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {dataset.columns.map((column, index) => {
            const columnType = inferColumnType(dataset.data, index);
            const stats = calculateColumnStats(dataset.data, index);
            
            return (
              <div key={column} className="bg-muted/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{column}</p>
                    <p className="text-xs text-muted-foreground">
                      {columnType}
                    </p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-medium">
                      {index + 1}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Data Completeness</span>
                    <span className="font-medium">
                      {stats.completeness.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${stats.completeness}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-background/50 rounded p-2">
                    <p className="text-xs text-muted-foreground">Unique Values</p>
                    <p className="text-sm font-medium">
                      {stats.uniqueCount.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-background/50 rounded p-2">
                    <p className="text-xs text-muted-foreground">Missing Values</p>
                    <p className="text-sm font-medium">
                      {stats.missingCount.toLocaleString()}
                    </p>
                  </div>
                </div>

                {stats.numericStats && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-background/50 rounded p-2">
                      <p className="text-xs text-muted-foreground">Range</p>
                      <p className="text-sm font-medium">
                        {stats.numericStats.min.toFixed(1)} - {stats.numericStats.max.toFixed(1)}
                      </p>
                    </div>
                    <div className="bg-background/50 rounded p-2">
                      <p className="text-xs text-muted-foreground">Mean</p>
                      <p className="text-sm font-medium">
                        {stats.numericStats.mean.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Quality Metrics */}
      <div>
        <h4 className="text-sm font-medium mb-3">Data Quality Overview</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Completeness</p>
            <p className="text-xl font-semibold mt-1">
              {(dataset.columns.reduce((acc, _, i) => 
                acc + calculateColumnStats(dataset.data, i).completeness, 0
              ) / dataset.columns.length).toFixed(1)}%
            </p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Unique Ratio</p>
            <p className="text-xl font-semibold mt-1">
              {(dataset.columns.reduce((acc, _, i) => {
                const stats = calculateColumnStats(dataset.data, i);
                return acc + (stats.uniqueCount / dataset.data.length) * 100;
              }, 0) / dataset.columns.length).toFixed(1)}%
            </p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Numeric Columns</p>
            <p className="text-xl font-semibold mt-1">
              {dataset.columns.filter((_, i) => 
                inferColumnType(dataset.data, i) === 'Numeric'
              ).length}
            </p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Categorical Columns</p>
            <p className="text-xl font-semibold mt-1">
              {dataset.columns.filter((_, i) => 
                inferColumnType(dataset.data, i) === 'Categorical'
              ).length}
            </p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Add these helper functions
const inferColumnType = (data: any[][], colIndex: number): string => {
  const sample = data.slice(0, 100).map(row => row[colIndex]);
  const nonNullSample = sample.filter(val => val !== null && val !== undefined);
  
  if (nonNullSample.every(val => typeof val === 'number')) return 'Numeric';
  if (nonNullSample.every(val => typeof val === 'boolean')) return 'Boolean';
  if (nonNullSample.every(val => !isNaN(Date.parse(val)))) return 'Date';
  return 'Categorical';
};

const calculateMissingPercentage = (data: any[][], colIndex: number): number => {
  const totalRows = data.length;
  const missingCount = data.filter(row => 
    row[colIndex] === null || row[colIndex] === undefined || row[colIndex] === ''
  ).length;
  return Math.round((missingCount / totalRows) * 100);
};

// Add utility functions for metrics calculation
const calculateDataQuality = (originalData: any[][], syntheticData: string): number => {
  // Parse synthetic data
  const parsedSynthetic = Papa.parse(syntheticData, { header: true }).data;
  
  // Calculate various quality metrics
  const completeness = calculateCompleteness(parsedSynthetic);
  const rangePreservation = calculateRangePreservation(originalData, parsedSynthetic);
  const distributionSimilarity = calculateDistributionSimilarity(originalData, parsedSynthetic);
  
  // Weighted average of quality metrics
  const qualityScore = (completeness * 0.4 + rangePreservation * 0.3 + distributionSimilarity * 0.3);
  return Math.round(qualityScore * 100);
};

const calculateCompleteness = (data: any[]): number => {
  const totalFields = Object.keys(data[0] || {}).length * data.length;
  const nonNullFields = data.reduce((acc, row) => {
    return acc + Object.values(row).filter(val => 
      val !== null && val !== undefined && val !== ''
    ).length;
  }, 0);
  return nonNullFields / totalFields;
};

const calculateRangePreservation = (originalData: any[][], syntheticData: any[]): number => {
  const originalRanges = calculateColumnRanges(originalData);
  const syntheticRanges = calculateColumnRanges(syntheticData);
  
  let totalPreservation = 0;
  let numericColumns = 0;
  
  Object.keys(originalRanges).forEach(col => {
    if (syntheticRanges[col]) {
      const origRange = originalRanges[col].max - originalRanges[col].min;
      const synthRange = syntheticRanges[col].max - syntheticRanges[col].min;
      if (origRange !== 0) {
        totalPreservation += Math.min(synthRange / origRange, 1);
        numericColumns++;
      }
    }
  });
  
  return numericColumns > 0 ? totalPreservation / numericColumns : 1;
};

const calculateColumnRanges = (data: any[]): Record<string, { min: number; max: number }> => {
  const ranges: Record<string, { min: number; max: number }> = {};
  
  if (Array.isArray(data) && data.length > 0) {
    const columns = Array.isArray(data[0]) ? 
      Array.from({ length: data[0].length }, (_, i) => i.toString()) : 
      Object.keys(data[0]);
    
    columns.forEach(col => {
      const values = Array.isArray(data[0]) ?
        data.map(row => parseFloat(row[parseInt(col)])).filter(v => !isNaN(v)) :
        data.map(row => parseFloat(row[col])).filter(v => !isNaN(v));
      
      if (values.length > 0) {
        ranges[col] = {
          min: Math.min(...values),
          max: Math.max(...values)
        };
      }
    });
  }
  
  return ranges;
};

const calculateDistributionSimilarity = (originalData: any[][], syntheticData: any[]): number => {
  // Simple distribution similarity based on quartile comparison
  let totalSimilarity = 0;
  let numericColumns = 0;
  
  const getQuartiles = (values: number[]) => {
    const sorted = values.sort((a, b) => a - b);
    return {
      q1: sorted[Math.floor(sorted.length * 0.25)],
      q2: sorted[Math.floor(sorted.length * 0.5)],
      q3: sorted[Math.floor(sorted.length * 0.75)]
    };
  };
  
  const columns = Array.from({ length: originalData[0].length }, (_, i) => i);
  
  columns.forEach(colIndex => {
    const originalValues = originalData.map(row => parseFloat(row[colIndex])).filter(v => !isNaN(v));
    const syntheticValues = syntheticData.map(row => {
      const val = Object.values(row)[colIndex];
      return parseFloat(val as string);
    }).filter(v => !isNaN(v));
    
    if (originalValues.length > 0 && syntheticValues.length > 0) {
      const origQuartiles = getQuartiles(originalValues);
      const synthQuartiles = getQuartiles(syntheticValues);
      
      const similarity = 1 - (
        Math.abs(origQuartiles.q1 - synthQuartiles.q1) / Math.abs(origQuartiles.q1) +
        Math.abs(origQuartiles.q2 - synthQuartiles.q2) / Math.abs(origQuartiles.q2) +
        Math.abs(origQuartiles.q3 - synthQuartiles.q3) / Math.abs(origQuartiles.q3)
      ) / 3;
      
      totalSimilarity += Math.max(0, Math.min(1, similarity));
      numericColumns++;
    }
  });
  
  return numericColumns > 0 ? totalSimilarity / numericColumns : 1;
};

const calculateSyntheticFileSize = (data: string): string => {
  const bytes = new Blob([data]).size;
  return formatFileSize(bytes);
};

interface SyntheticMetrics {
  mean: number;
  min: number;
  max: number;
  uniqueCount: number;
}

const calculateSyntheticMetrics = async (syntheticData: Blob): Promise<Record<string, SyntheticMetrics>> => {
  try {
    // Convert Blob to text
    const text = await syntheticData.text();
    
    // Parse the CSV text
    const parsedData = Papa.parse(text, { header: true }).data as Record<string, string>[];
    if (!parsedData.length || !parsedData[0]) {
      throw new Error('No data found in synthetic dataset');
    }

    const columns = Object.keys(parsedData[0]);
    const metrics: Record<string, SyntheticMetrics> = {};
    
    columns.forEach(column => {
      const values = parsedData
        .map(row => row[column] ? parseFloat(row[column]) : NaN)
        .filter(val => !isNaN(val));
        
      if (values.length > 0) {
        metrics[column] = {
          mean: values.reduce((a, b) => a + b, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          uniqueCount: new Set(values).size
        };
      }
    });
    
    return metrics;
  } catch (error) {
    console.error('Error calculating synthetic metrics:', error);
    throw error;
  }
};

export default function Home() {
  const {
    selectedFile,
    setSelectedFile,
    dataset,
    setDataset,
    generatedData,
    setGeneratedData,
    generationMetrics,
    setGenerationMetrics,
  } = useData()
  const [selectedModel, setSelectedModel] = useState("vae")
  const [sampleSize, setSampleSize] = useState(1000)
  const [isGenerating, setIsGenerating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addNotification } = useNotifications()
  const [uploadSuccessOpen, setUploadSuccessOpen] = useState(false)
  const [uploadedFileDetails, setUploadedFileDetails] = useState<{
    name: string;
    rows: number;
    columns: number;
  } | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showStatusPopup, setShowStatusPopup] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationStage, setGenerationStage] = useState('')
  const [isPopupClosing, setIsPopupClosing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    
    if (!file) {
      addNotification(
        "Upload Error",
        "No file was dropped. Please try again.",
        "alert"
      )
      return
    }

    if (file.name.endsWith('.csv')) {
      addNotification(
        "File Received",
        "Starting to process your CSV file...",
        "action"
      )
      await handleFileProcess(file)
    } else {
      toast.error("Please upload a CSV file")
      addNotification(
        "Invalid File Type",
        "Only CSV files are supported. Please upload a valid CSV file.",
        "alert"
      )
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    
    if (!file) {
      addNotification(
        "Upload Error",
        "No file was selected. Please try again.",
        "alert"
      )
      return
    }

    if (file.name.endsWith('.csv')) {
      addNotification(
        "File Selected",
        "Starting to process your CSV file...",
        "action"
      )
      await handleFileProcess(file)
    } else if (file) {
      toast.error("Please upload a CSV file")
      addNotification(
        "Invalid File Type",
        "Only CSV files are supported. Please upload a valid CSV file.",
        "alert"
      )
    }
  }

  const handleFileProcess = async (file: File) => {
    setIsUploading(true);
    setSelectedFile(file);
    
    try {
      // Create FormData to send the file
      const formData = new FormData();
      formData.append('file', file);

      // Upload the file to our server
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      // Process the CSV data
      const processedData = await processCSV(file);
      setDataset(processedData);
      setUploadedFileDetails({
        name: file.name,
        rows: processedData.data.length,
        columns: processedData.columns.length
      });
      
      // Show the success popup
      setIsPopupClosing(false);
      setUploadSuccessOpen(true);
      
      // Auto-dismiss with animation after 4 seconds
      setTimeout(() => {
        setIsPopupClosing(true);
        setTimeout(() => {
          setUploadSuccessOpen(false);
          setIsPopupClosing(false);
        }, 300);
      }, 4000);

      addNotification(
        "Dataset Uploaded",
        `Successfully processed ${file.name}`,
        "action"
      );
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Error processing file");
      addNotification(
        "Upload Error",
        "Failed to process the file. Please ensure it's a valid CSV.",
        "alert"
      );
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      if (!selectedFile || !dataset) {
        throw new Error('Please upload a dataset first');
      }

      if (!sampleSize || sampleSize < 1) {
        throw new Error('Please specify a valid sample size');
      }

      // Show initial progress
      setGenerationStage('Starting generation process...');
      setGenerationProgress(10);

      const result = await generateSyntheticData(selectedFile, sampleSize);
      
      if (result.success && result.data) {
        setGenerationStage('Calculating metrics...');
        setGenerationProgress(70);

        const columnMetrics = await calculateSyntheticMetrics(result.data);
        
        // Calculate overall metrics
        const overallUniqueRatio = Object.values(columnMetrics).reduce((acc, metrics) => {
          return acc + (metrics.uniqueCount ? metrics.uniqueCount / sampleSize : 0);
        }, 0) / Object.keys(columnMetrics).length * 100;

        setGenerationMetrics({
          fileSize: calculateSyntheticFileSize(result.data),
          columnMetrics: columnMetrics,
          overallMetrics: {
            uniqueRatio: overallUniqueRatio,
            overallCompleteness: 100
          }
        });
        
        setGeneratedData(result.data);
        setGenerationStage('Generation complete!');
        setGenerationProgress(100);

        toast.success("Synthetic data generated successfully!");
        addNotification(
          "Generation Complete",
          "Your synthetic dataset has been generated successfully",
          "action"
        );
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      addNotification(
        "Generation Failed",
        errorMessage,
        "alert"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    if (!generatedData) {
      toast.error("No generated data available")
      return
    }

    try {
      const blob = new Blob([generatedData], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'synthetic_data.csv'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast.success("Dataset exported successfully")
    } catch (error) {
      console.error("Error exporting data:", error)
      toast.error("Error exporting data")
    }
  }

  const handleChooseFile = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 font-sans leading-tight text-center hover:text-gray-700 transition-colors duration-300">
  Double your Data, Increase your Insights: Let our AI clone your Data into a Digital Twin!
</h2>
          
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-2 border-0 shadow-none bg-transparent">
          <CardContent>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 transition-all duration-300 ${
                isUploading 
                  ? 'border-primary border-opacity-50 bg-primary/5' 
                  : selectedFile
                  ? 'border-success bg-success/5'
                  : 'border-muted hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className={`rounded-full p-4 transition-all duration-300 ${
                  isUploading 
                    ? 'bg-primary/20' 
                    : selectedFile
                    ? 'bg-success/20'
                    : 'bg-muted'
                }`}>
                  {isUploading ? (
                    <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  ) : selectedFile ? (
                    <CheckCircle2 className="h-10 w-10 text-success" />
                  ) : (
                    <Upload className="h-10 w-10 text-muted-foreground group-hover:text-primary" />
                  )}
                </div>
                
                <div className="space-y-2 max-w-xs">
                  <h3 className="font-semibold text-xl">
                    {isUploading 
                      ? 'Processing File...' 
                      : selectedFile 
                      ? 'File Ready' 
                      : 'Upload Your Dataset'
                    }
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isUploading 
                      ? 'Analyzing and preparing your dataset' 
                      : selectedFile 
                      ? 'Click Generate to create synthetic data' 
                      : 'Drag-drop your CSV file here, or click to browse'
                    }
                  </p>
                </div>

                {!selectedFile && !isUploading && (
                  <Button 
                    variant="outline" 
                    className="relative group mt-4"
                    onClick={handleChooseFile}
                  >
                    <Upload className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                    Choose File
                  </Button>
                )}

                <Input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>

              {isUploading && (
                <div className="absolute bottom-4 animate-fade-up flex items-center gap-2 text-sm bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <FileUp className="h-4 w-4 text-primary animate-bounce" />
                    <span>Processing <span className="font-medium">{selectedFile?.name}</span></span>
                  </div>
                </div>
              )}

              {selectedFile && !isUploading && showStatusPopup && (
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 animate-fade-up flex items-center gap-2 text-sm bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-success" />
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>
                      <span className="font-medium">{selectedFile.name}</span> ready for generation
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {dataset && selectedFile && (
          <DatasetParameters dataset={dataset} file={selectedFile} />
        )}

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-primary" />
              Generate Synthetic Numerical Data
            </CardTitle>
            <CardDescription>
              Configure and generate high-quality synthetic numerical data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {dataset ? (
              <div className="space-y-6">
                {/* Generation Configuration */}
                <div className="bg-muted/30 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Settings2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Generation Settings</h3>
                      <p className="text-sm text-muted-foreground">Configure your Synthetic Data Output</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label htmlFor="sample-size">Sample Size</Label>
                      <div className="relative">
                        <Input
                          id="sample-size"
                          type="number"
                          value={sampleSize}
                          onChange={(e) => setSampleSize(parseInt(e.target.value))}
                          min={100}
                          max={100000}
                          disabled={!dataset || isGenerating}
                          className="pr-20"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          samples
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center">
                  <Button 
                    size="lg"
                    className="w-full sm:w-auto"
                    onClick={handleGenerate}
                    disabled={!dataset || isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Data
                      </>
                    )}
                  </Button>
                </div>

                {/* Generation Status and Results */}
                {isGenerating ? (
                  <div className="bg-muted/30 rounded-lg p-6 text-center">
                    <div className="relative pt-4">
                      <div className="flex items-center justify-center">
                        <div className="relative h-28 w-28">
                          <div className="absolute inset-0 rounded-full border-4 border-muted" />
                          <div 
                            className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
                            style={{ 
                              transform: `rotate(${generationProgress * 3.6}deg)`,
                              transition: 'transform 0.3s ease-out'
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-semibold">{generationProgress}%</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-center text-sm text-primary mt-4 progress-pulse font-medium">
                        {generationStage}
                      </p>
                    </div>
                  </div>
                ) : generatedData ? (
                  <div className="flex flex-col items-center text-center mt-4">
                    <div className="bg-success/10 rounded-lg p-4 w-full">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
                          <CheckCircle2 className="h-6 w-6 text-success" />
                        </div>
                        <div>
                          <h4 className="font-medium text-success">Generation Complete</h4>
                          <p className="text-sm text-muted-foreground">
                            Your synthetic data is ready for export
                          </p>
                        </div>
                      </div>

                      {/* New Metrics Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-primary/5 rounded-lg p-6 relative overflow-hidden">
                          <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <Shield className="h-4 w-4 text-primary" />
                              </div>
                              <h3 className="font-medium">Generated Samples</h3>
                            </div>
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-bold">{sampleSize.toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">Total synthetic records</p>
                          </div>
                          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-primary/5 to-transparent" />
                        </div>

                        <div className="bg-[hsl(var(--chart-1))]/5 rounded-lg p-6 relative overflow-hidden">
                          <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="h-8 w-8 rounded-full bg-[hsl(var(--chart-1))]/20 flex items-center justify-center">
                                <Settings2 className="h-4 w-4 text-[hsl(var(--chart-1))]" />
                              </div>
                              <h3 className="font-medium">Overall Completeness</h3>
                            </div>
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-bold">
                                {generationMetrics.overallMetrics?.overallCompleteness.toFixed(1)}%
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">Data completeness</p>
                          </div>
                          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[hsl(var(--chart-1))]/5 to-transparent" />
                        </div>

                        <div className="bg-[hsl(var(--chart-2))]/5 rounded-lg p-6 relative overflow-hidden">
                          <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="h-8 w-8 rounded-full bg-[hsl(var(--chart-2))]/20 flex items-center justify-center">
                                <Wand2 className="h-4 w-4 text-[hsl(var(--chart-2))]" />
                              </div>
                              <h3 className="font-medium">Unique Ratio</h3>
                            </div>
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-bold">
                                {generationMetrics.overallMetrics?.uniqueRatio.toFixed(1)}%
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">Average unique ratio</p>
                          </div>
                          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[hsl(var(--chart-2))]/5 to-transparent" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-primary/5 rounded-lg p-6 text-center">
                    <Wand2 className="h-12 w-12 text-primary/50 mx-auto mb-3" />
                    <p className="text-sm text-primary font-medium">
                      Ready to generate {sampleSize.toLocaleString()} synthetic samples
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Click Generate to start the process
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center space-y-2">
                <Wand2 className="h-12 w-12 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  Upload a dataset to start generating synthetic numerical data
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {generatedData && (
        <>
          {/* Export Generated Data Card */}
          <Card className="col-span-2 mt-6">
            <CardHeader>
              <CardTitle>Export Generated Data</CardTitle>
              <CardDescription>
                Download your synthetic dataset or analyze its characteristics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto"
                  onClick={handleExport}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileUp className="h-4 w-4" />
                  <span>Generated file size: </span>
                  <span className="font-medium text-foreground">{generationMetrics.fileSize}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Column-wise Metrics Card - Now Separate */}
          {generatedData && generationMetrics && (
            <Card className="col-span-2 mt-6">
              <CardHeader>
                <CardTitle>Column-wise Metrics</CardTitle>
                <CardDescription>
                  Detailed analysis of each generated column
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {dataset?.columns.map((column) => {
                    const columnMetrics = generationMetrics.columnMetrics?.[column];
                    if (!columnMetrics) return null;

                    return (
                      <div key={column} className="bg-muted/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">{column}</h4>
                          <div className="text-sm text-muted-foreground">
                            {columnMetrics.mean ? `${columnMetrics.mean.toFixed(2)} avg` : 'N/A'}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Unique Values</p>
                            <p className="text-lg font-medium">{columnMetrics.uniqueCount?.toLocaleString() ?? 'N/A'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Range</p>
                            <p className="text-lg font-medium">
                              {columnMetrics.min !== undefined && columnMetrics.max !== undefined
                                ? `${columnMetrics.min.toFixed(2)} - ${columnMetrics.max.toFixed(2)}`
                                : 'N/A'}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Mean</p>
                            <p className="text-lg font-medium">
                              {columnMetrics.mean !== undefined ? columnMetrics.mean.toFixed(2) : 'N/A'}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Unique Ratio</p>
                            <p className="text-lg font-medium">
                              {columnMetrics.uniqueCount && dataset
                                ? `${((columnMetrics.uniqueCount / dataset.data.length) * 100).toFixed(1)}%`
                                : 'N/A'}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all duration-500"
                              style={{ 
                                width: `${columnMetrics.uniqueCount && dataset
                                  ? (columnMetrics.uniqueCount / dataset.data.length) * 100
                                  : 0}%` 
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {uploadedFileDetails && uploadSuccessOpen && (
        <UploadSuccessPopup
          fileName={uploadedFileDetails.name}
          isClosing={isPopupClosing}
        />
      )}
    </div>
  )
}