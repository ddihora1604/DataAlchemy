"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, Eye, Trash2, Database } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { GenerationDetailsDialog } from "@/components/generation-details-dialog"

export default function GeneratedData() {
  const [datasets, setDatasets] = useState([
    {
      id: 1,
      name: "synthetic_data_001.csv",
      model: "VAE",
      timestamp: "2025-01-15 14:30",
      size: "1,000 rows",
      status: "Completed",
      accuracy: "95%",
    },
    {
      id: 2,
      name: "financial_synthetic.csv",
      model: "Tabular GAN",
      timestamp: "2025-01-14 09:15",
      size: "5,000 rows",
      status: "Completed",
      accuracy: "92%",
    },
  ])

  const [history] = useState([
    {
      id: 1,
      timestamp: "2025-01-15",
      model: "VAE",
      parameters: "Latent dim: 32, Batch: 64",
      status: "Completed",
      duration: "5m 30s",
      datasetInfo: {
        rowCount: 10000,
        columnCount: 15,
        dataTypes: {
          "age": "numeric",
          "income": "numeric",
          "occupation": "categorical",
          "education": "categorical",
        },
        sampleRows: [
          { age: 25, income: 50000, occupation: "Engineer", education: "Bachelor's" },
          { age: 35, income: 75000, occupation: "Manager", education: "Master's" }
        ]
      },
      modelMetrics: {
        accuracy: "95%",
        privacy_score: "0.92",
        correlation_similarity: "0.89",
        distribution_similarity: "0.91"
      },
      generationConfig: {
        batchSize: 64,
        epochs: 100,
        learningRate: 0.001,
        architecture: "Standard VAE with 3 hidden layers",
        optimizerSettings: "Adam (β1=0.9, β2=0.999)"
      }
    },
    {
      id: 2,
      timestamp: "2025-01-14",
      model: "Tabular GAN",
      parameters: "Epochs: 100, LR: 0.001",
      status: "Completed",
      duration: "15m 45s",
      datasetInfo: {
        rowCount: 5000,
        columnCount: 10,
        dataTypes: {
          "transaction_amount": "numeric",
          "transaction_type": "categorical",
          "merchant_category": "categorical",
          "timestamp": "datetime"
        },
        sampleRows: [
          { transaction_amount: 150.25, transaction_type: "purchase", merchant_category: "retail", timestamp: "2025-01-14 10:30:00" },
          { transaction_amount: 75.50, transaction_type: "payment", merchant_category: "services", timestamp: "2025-01-14 11:15:00" }
        ]
      },
      modelMetrics: {
        accuracy: "92%",
        privacy_score: "0.95",
        correlation_similarity: "0.87",
        distribution_similarity: "0.88"
      },
      generationConfig: {
        batchSize: 128,
        epochs: 150,
        learningRate: 0.0005,
        architecture: "WGAN-GP with gradient penalty",
        optimizerSettings: "RMSprop (lr=0.0005)"
      }
    },
    {
      id: 3,
      timestamp: "2025-01-13",
      model: "Copula",
      parameters: "Gaussian Copula",
      status: "Completed",
      duration: "3m 15s",
      datasetInfo: {
        rowCount: 2000,
        columnCount: 8,
        dataTypes: {
          "temperature": "numeric",
          "humidity": "numeric",
          "pressure": "numeric",
          "wind_speed": "numeric"
        },
        sampleRows: [
          { temperature: 22.5, humidity: 65, pressure: 1013, wind_speed: 12 },
          { temperature: 24.0, humidity: 70, pressure: 1015, wind_speed: 8 }
        ]
      },
      modelMetrics: {
        accuracy: "94%",
        privacy_score: "0.97",
        correlation_similarity: "0.93",
        distribution_similarity: "0.94"
      },
      generationConfig: {
        batchSize: 256,
        epochs: 50,
        learningRate: 0.001,
        architecture: "Gaussian Copula with empirical margins",
        optimizerSettings: "Maximum Likelihood Estimation"
      }
    }
  ])

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [datasetToDelete, setDatasetToDelete] = useState<number | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedGeneration, setSelectedGeneration] = useState<any>(null)

  const handleDownload = (dataset: typeof datasets[0]) => {
    // In a real application, this would make an API call to get the actual data
    // For now, we'll simulate a download
    const dummyData = `id,value\n1,100\n2,200\n3,300`
    const blob = new Blob([dummyData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = dataset.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    toast.success(`Downloading ${dataset.name}`)
  }

  const handleDeleteClick = (datasetId: number) => {
    setDatasetToDelete(datasetId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (datasetToDelete) {
      setDatasets(datasets.filter(d => d.id !== datasetToDelete))
      toast.success("Dataset deleted successfully")
      setDeleteDialogOpen(false)
      setDatasetToDelete(null)
    }
  }

  const handleViewDetails = (item: any) => {
    setSelectedGeneration(item)
    setIsDetailsOpen(true)
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Data Generation</h2>
      </div>
      
      <Tabs defaultValue="datasets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="datasets">Generated Datasets</TabsTrigger>
          <TabsTrigger value="history">Generation History</TabsTrigger>
        </TabsList>

        <TabsContent value="datasets">
          <Card>
            <CardHeader>
              <CardTitle>Generated Datasets</CardTitle>
            </CardHeader>
            <CardContent>
              {datasets.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dataset Name</TableHead>
                      <TableHead>Model Type</TableHead>
                      <TableHead>Generated At</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Accuracy</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {datasets.map((dataset) => (
                      <TableRow key={`${dataset.id}-${dataset.timestamp}`}>
                        <TableCell>{dataset.name}</TableCell>
                        <TableCell>{dataset.model}</TableCell>
                        <TableCell>{dataset.timestamp}</TableCell>
                        <TableCell>{dataset.size}</TableCell>
                        <TableCell>{dataset.status}</TableCell>
                        <TableCell>{dataset.accuracy}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDownload(dataset)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteClick(dataset.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Database className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    No Datasets Generated Yet
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Generate your first synthetic dataset using the generation form. Your generated datasets will appear here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Generation History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Parameters</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.timestamp}</TableCell>
                      <TableCell>{item.model}</TableCell>
                      <TableCell>{item.parameters}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>{item.duration}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewDetails(item)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedGeneration && (
        <GenerationDetailsDialog
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          details={selectedGeneration}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the dataset.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}