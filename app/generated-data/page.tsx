"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, Eye, Trash2, Database, Clock, FileSpreadsheet } from "lucide-react"
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

// Update the GeneratedDataset type
type GeneratedDataset = {
  id: number;
  name: string;
  originalDataset: string;
  uploadTime: string;
  generationDuration: string;
  sampleCount: number;
  timestamp: string;
  syntheticData: string; // CSV string of the generated data
}

export default function GeneratedData() {
  // Load datasets from localStorage on component mount
  const [datasets, setDatasets] = useState<GeneratedDataset[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [datasetToDelete, setDatasetToDelete] = useState<number | null>(null)

  useEffect(() => {
    const storedDatasets = localStorage.getItem('generatedDatasets')
    if (storedDatasets) {
      setDatasets(JSON.parse(storedDatasets))
    }
  }, [])

  const handleDownload = (dataset: GeneratedDataset) => {
    const blob = new Blob([dataset.syntheticData], { type: 'text/csv' })
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
      const updatedDatasets = datasets.filter(d => d.id !== datasetToDelete)
      setDatasets(updatedDatasets)
      localStorage.setItem('generatedDatasets', JSON.stringify(updatedDatasets))
      toast.success("Dataset deleted successfully")
      setDeleteDialogOpen(false)
      setDatasetToDelete(null)
    }
  }

  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedGeneration, setSelectedGeneration] = useState<any>(null)

  const handleViewDetails = (item: any) => {
    setSelectedGeneration(item)
    setIsDetailsOpen(true)
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Generated Datasets</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Synthetic Datasets</CardTitle>
        </CardHeader>
        <CardContent>
          {datasets.length > 0 ? (
            <div className="space-y-4">
              {datasets.map((dataset) => (
                <div
                  key={dataset.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-primary" />
                      <p className="font-medium">{dataset.name}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Generated {dataset.timestamp}</span>
                      </div>
                      <div>•</div>
                      <div>Duration: {dataset.generationDuration || 'N/A'}</div>
                      <div>•</div>
                      <div>{(dataset.sampleCount || 0).toLocaleString()} samples</div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Original dataset: {dataset.originalDataset || 'Unknown'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(dataset)}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(dataset.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Database className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No Datasets Generated Yet
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Upload a dataset and generate synthetic data to see it here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the synthetic dataset.
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

      {selectedGeneration && (
        <GenerationDetailsDialog
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          details={selectedGeneration}
        />
      )}
    </div>
  )
}