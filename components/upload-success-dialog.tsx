"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

type UploadSuccessProps = {
  isOpen: boolean
  onClose: () => void
  fileName: string
  fileDetails: {
    rows: number
    columns: number
  }
}

export function UploadSuccessDialog({ isOpen, onClose, fileName, fileDetails }: UploadSuccessProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
            <div>
              <DialogTitle>Upload Successful!</DialogTitle>
              <DialogDescription>
                Your dataset has been uploaded and processed successfully
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">File Details</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><strong>File Name:</strong> {fileName}</li>
              <li><strong>Rows:</strong> {fileDetails.rows}</li>
              <li><strong>Columns:</strong> {fileDetails.columns}</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 