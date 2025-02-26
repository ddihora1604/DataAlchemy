"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type GenerationDetailsProps = {
  isOpen: boolean
  onClose: () => void
  details: {
    id: number
    timestamp: string
    model: string
    parameters: string
    status: string
    duration: string
    datasetInfo: {
      rowCount: number
      columnCount: number
      dataTypes: { [key: string]: string }
      sampleRows: any[]
    }
    modelMetrics: {
      accuracy: string
      privacy_score: string
      correlation_similarity: string
      distribution_similarity: string
    }
    generationConfig: {
      batchSize: number
      epochs: number
      learningRate: number
      architecture: string
      optimizerSettings: string
    }
  }
}

export function GenerationDetailsDialog({ isOpen, onClose, details }: GenerationDetailsProps) {
  // Add default values for optional properties
  const datasetInfo = details.datasetInfo || {
    rowCount: 0,
    columnCount: 0,
    dataTypes: {},
    sampleRows: []
  }

  const modelMetrics = details.modelMetrics || {
    accuracy: "N/A",
    privacy_score: "N/A",
    correlation_similarity: "N/A",
    distribution_similarity: "N/A"
  }

  const generationConfig = details.generationConfig || {
    batchSize: 0,
    epochs: 0,
    learningRate: 0,
    architecture: "N/A",
    optimizerSettings: "N/A"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Generation Details</DialogTitle>
          <DialogDescription>
            Detailed information about the data generation process
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-120px)]">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {datasetInfo.rowCount > 0 && (
                <TabsTrigger value="dataset">Dataset Info</TabsTrigger>
              )}
              {generationConfig.architecture !== "N/A" && (
                <TabsTrigger value="model">Model Details</TabsTrigger>
              )}
              {modelMetrics.accuracy !== "N/A" && (
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Generation Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium">Timestamp</h4>
                      <p className="text-sm text-muted-foreground">{details.timestamp}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Model</h4>
                      <p className="text-sm text-muted-foreground">{details.model}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Status</h4>
                      <p className="text-sm text-muted-foreground">{details.status}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Duration</h4>
                      <p className="text-sm text-muted-foreground">{details.duration}</p>
                    </div>
                    {datasetInfo.rowCount > 0 && (
                      <div>
                        <h4 className="font-medium">Dataset Size</h4>
                        <p className="text-sm text-muted-foreground">
                          {datasetInfo.rowCount} rows × {datasetInfo.columnCount} columns
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {datasetInfo.rowCount > 0 && (
              <TabsContent value="dataset">
                <Card>
                  <CardHeader>
                    <CardTitle>Dataset Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Data Types</h4>
                        <div className="text-sm text-muted-foreground">
                          {Object.entries(details.datasetInfo.dataTypes).map(([col, type]) => (
                            <div key={col}>
                              {col}: {type}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium">Sample Data</h4>
                        <div className="text-sm text-muted-foreground overflow-x-auto">
                          <table className="min-w-full">
                            <thead>
                              <tr>
                                {Object.keys(details.datasetInfo.sampleRows[0] || {}).map(header => (
                                  <th key={header} className="px-2 py-1 text-left">{header}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {details.datasetInfo.sampleRows.map((row, idx) => (
                                <tr key={idx}>
                                  {Object.values(row).map((value, i) => (
                                    <td key={i} className="px-2 py-1">{String(value)}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {generationConfig.architecture !== "N/A" && (
              <TabsContent value="model">
                <Card>
                  <CardHeader>
                    <CardTitle>Model Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium">Architecture</h4>
                        <p className="text-sm text-muted-foreground">{details.generationConfig.architecture}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Batch Size</h4>
                        <p className="text-sm text-muted-foreground">{details.generationConfig.batchSize}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Epochs</h4>
                        <p className="text-sm text-muted-foreground">{details.generationConfig.epochs}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Learning Rate</h4>
                        <p className="text-sm text-muted-foreground">{details.generationConfig.learningRate}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Optimizer Settings</h4>
                        <p className="text-sm text-muted-foreground">{details.generationConfig.optimizerSettings}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {modelMetrics.accuracy !== "N/A" && (
              <TabsContent value="metrics">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium">Accuracy</h4>
                        <p className="text-sm text-muted-foreground">{details.modelMetrics.accuracy}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Privacy Score</h4>
                        <p className="text-sm text-muted-foreground">{details.modelMetrics.privacy_score}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Correlation Similarity</h4>
                        <p className="text-sm text-muted-foreground">{details.modelMetrics.correlation_similarity}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Distribution Similarity</h4>
                        <p className="text-sm text-muted-foreground">{details.modelMetrics.distribution_similarity}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 