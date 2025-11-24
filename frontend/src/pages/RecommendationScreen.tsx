"use client"

import type React from "react"
import { useState } from "react"
import { ChevronUp } from "lucide-react"

interface RecommendationScreenProps {
  onBack: () => void
}

const categories = [
  { id: 1, name: "한식계열", emoji: "🍲", color: "bg-red-500", description: "한국음을 추천할 거야" },
  { id: 2, name: "해플안적", emoji: "🍤", color: "bg-yellow-400", description: "비타민은 중요해!" },
  { id: 3, name: "따뜻한 국숟", emoji: "🍜", color: "bg-green-500", description: "속이 든든해조" },
  { id: 4, name: "소재비", emoji: "🍱", color: "bg-blue-500", description: "든든한 식성이 필요!" },
]

export default function RecommendationScreen({ onBack }: RecommendationScreenProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.classList.add("border-orange-500", "bg-orange-50")
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.classList.remove("border-orange-500", "bg-orange-50")
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.classList.remove("border-orange-500", "bg-orange-50")
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("사진을 선택해주세요")
      return
    }
    setIsUploading(true)
    setTimeout(() => {
      setIsUploading(false)
    }, 2000)
  }

  if (preview) {
    return (
      <div className="max-w-2xl mx-auto p-4 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">사진 인증</h1>
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <ChevronUp size={24} />
          </button>
        </div>

        <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-96 object-cover rounded-2xl" />

        <button
          onClick={() => {
            setPreview(null)
            setSelectedFile(null)
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          다른 사진 선택
        </button>

        <button
          onClick={handleUpload}
          disabled={isUploading}
          className="w-full px-4 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? "업로드 중..." : "인증 완료 및 도감 보기"}
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">밥토리의 추천</h1>
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
          <ChevronUp size={24} />
        </button>
      </div>

      <div className="bg-blue-100 rounded-lg p-4 text-center">
        <p className="text-blue-900 font-medium">다 뭐 먹을래?</p>
      </div>

      {/* 2x2 그리드 카테고리 카드 */}
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => (
          <div key={category.id} className={`${category.color} rounded-2xl p-6 text-white shadow-md`}>
            <div className="text-4xl mb-3 text-center">{category.emoji}</div>
            <div className="flex flex-wrap gap-2 mb-3 justify-center">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white/30 rounded w-8 h-8 flex items-center justify-center text-sm font-bold">
                  ?
                </div>
              ))}
            </div>
            <h3 className="text-center font-bold text-sm mb-1">{category.name}</h3>
            <p className="text-center text-xs opacity-90 mb-3">{category.description}</p>
            <button className="w-full bg-yellow-400 text-gray-800 py-2 rounded-lg font-bold text-sm hover:bg-yellow-300 transition-colors">
              이게 딱이야!
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-bold text-gray-900 mt-8">또는 직접 인증하기</h2>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center transition-colors"
      >
        <p className="text-gray-700 font-medium mb-3">사진을 여기에 드래그하거나</p>
        <label className="inline-block px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors cursor-pointer">
          사진 선택
          <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
        </label>
      </div>
    </div>
  )
}
