"use client"

import type React from "react"

import { useRef } from "react"
import { Upload } from "lucide-react"
import { Card } from "@/components/ui/card"

interface UploadAreaProps {
  onFileSelect: (file: File) => void
}

export default function UploadArea({ onFileSelect }: UploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add("bg-primary/5", "border-primary")
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("bg-primary/5", "border-primary")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove("bg-primary/5", "border-primary")

    const files = e.dataTransfer.files
    if (files.length > 0) {
      onFileSelect(files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onFileSelect(files[0])
    }
  }

  return (
    <Card
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className="p-12 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer transition-colors hover:border-primary hover:bg-primary/5"
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-primary/10 rounded-full">
          <Upload size={40} className="text-primary" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">사진을 선택하세요</p>
          <p className="text-sm text-muted-foreground">클릭하거나 드래그 앤 드롭</p>
        </div>
      </div>

      <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
    </Card>
  )
}
