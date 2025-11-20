"use client"

import type React from "react"
import { useState } from "react"
import { useFoodRecords } from "../hooks/useFoodRecords"
import { useCharacter } from "../hooks/useCharacter"
import { Upload, ChevronUp } from "lucide-react"

interface UploadScreenProps {
  onBack: () => void
}

export default function UploadScreen({ onBack }: UploadScreenProps) {
  const { addRecord, mockFoods } = useFoodRecords()
  const { updateStats } = useCharacter()
  const [selectedFood, setSelectedFood] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<any>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVerify = () => {
    if (!uploadedImage || !selectedFood) return

    setIsVerifying(true)
    // 실제 AI 인식은 백엔드에서 처리
    setTimeout(() => {
      const food = mockFoods.find((f) => f.id === selectedFood)
      if (food) {
        const record = addRecord(food, uploadedImage)
        updateStats(record.satietyGain, record.friendshipGain, record.expGain)

        setVerificationResult({
          success: true,
          food: food.name,
          confidence: 92,
          satietyGain: record.satietyGain,
          friendshipGain: record.friendshipGain,
          expGain: record.expGain,
        })
      }
      setIsVerifying(false)
    }, 2000)
  }

  if (verificationResult) {
    return (
      <div className="p-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">인증 완료!</h1>
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <ChevronUp size={24} />
          </button>
        </div>

        <div className="bg-white rounded-2xl p-8 text-center space-y-6 shadow-md">
          <div className="text-6xl">✅</div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{verificationResult.food}이 확인되었어요!</h2>
            <p className="text-sm text-muted-foreground">신뢰도: {verificationResult.confidence}%</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center bg-orange-50 p-3 rounded-lg">
              <span className="font-semibold">포만감</span>
              <span className="text-lg font-bold text-primary">+{verificationResult.satietyGain}</span>
            </div>
            <div className="flex justify-between items-center bg-purple-50 p-3 rounded-lg">
              <span className="font-semibold">친밀도</span>
              <span className="text-lg font-bold text-secondary">+{verificationResult.friendshipGain}</span>
            </div>
            <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg">
              <span className="font-semibold">경험치</span>
              <span className="text-lg font-bold text-green-600">+{verificationResult.expGain}</span>
            </div>
          </div>

          <button
            onClick={onBack}
            className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors"
          >
            완료
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">사진 인증</h1>
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
          <ChevronUp size={24} />
        </button>
      </div>

      {/* 사진 업로드 영역 */}
      <div className="bg-white rounded-2xl p-8 shadow-md">
        <label className="block">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              uploadedImage ? "border-primary bg-primary/5" : "border-muted hover:border-primary"
            }`}
          >
            {uploadedImage ? (
              <div>
                <img
                  src={uploadedImage || "/placeholder.svg"}
                  alt="uploaded"
                  className="w-full max-h-64 object-cover rounded-lg mb-3"
                />
                <p className="text-sm text-muted-foreground">클릭하여 다시 선택</p>
              </div>
            ) : (
              <div>
                <Upload size={32} className="mx-auto mb-3 text-muted-foreground" />
                <p className="font-semibold text-foreground mb-1">사진을 업로드하세요</p>
                <p className="text-sm text-muted-foreground">드래그하거나 클릭</p>
              </div>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>
      </div>

      {/* 음식 선택 */}
      {uploadedImage && (
        <>
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-lg font-bold text-foreground mb-4">음식 선택</h2>
            <div className="grid grid-cols-2 gap-3">
              {mockFoods.map((food) => (
                <button
                  key={food.id}
                  onClick={() => setSelectedFood(food.id)}
                  className={`p-4 rounded-lg transition-all ${
                    selectedFood === food.id ? "bg-primary text-white" : "bg-muted hover:bg-muted/80 text-foreground"
                  }`}
                >
                  <div className="text-3xl mb-1">{food.emoji}</div>
                  <p className="font-semibold text-sm">{food.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 인증 버튼 */}
          <button
            onClick={handleVerify}
            disabled={!selectedFood || isVerifying}
            className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isVerifying ? "인증 중..." : "사진 인증하기"}
          </button>
        </>
      )}
    </div>
  )
}
