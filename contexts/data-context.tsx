"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { Dataset } from "@/lib/data-service"

interface DataContextType {
  selectedFile: File | null
  setSelectedFile: (file: File | null) => void
  dataset: Dataset | null
  setDataset: (dataset: Dataset | null) => void
  generatedData: string | null
  setGeneratedData: (data: string | null) => void
  generationMetrics: {
    fileSize?: string
    columnMetrics?: Record<string, any>
    overallMetrics?: Record<string, any>
  } | null
  setGenerationMetrics: (metrics: any) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [generatedData, setGeneratedData] = useState<string | null>(null)
  const [generationMetrics, setGenerationMetrics] = useState<{
    fileSize?: string
    columnMetrics?: Record<string, any>
    overallMetrics?: Record<string, any>
  } | null>(null)

  return (
    <DataContext.Provider
      value={{
        selectedFile,
        setSelectedFile,
        dataset,
        setDataset,
        generatedData,
        setGeneratedData,
        generationMetrics,
        setGenerationMetrics,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
} 