"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useFoodRecords } from "../hooks/useFoodRecords"
import { Upload, ChevronUp } from "lucide-react"
import { api } from "../lib/api" 

interface UploadScreenProps {
  onBack: () => void
}

interface FoodSelectResponse {
  message: string
  character_emoji: string
  rewards: {
    satiety_gain: number
    friendship_gain: number
    exp_gain: number
  }
  character: any // 나중에 필요하면 Character 타입으로 세부 정의해도 됨
  level_up: boolean
}

export default function UploadScreen({ onBack }: UploadScreenProps) {
  const { mockFoods } = useFoodRecords()  // ✅ addRecord 말고 mockFoods만 사용
  const [selectedFood, setSelectedFood] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadFile, setUploadFile] = useState<File | null>(null)   // ✅ 실제 파일 보관
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)           // ✅ 에러 메시지
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
      if (file) {
        setUploadFile(file)  // ✅ 실제 파일 저장

        const reader = new FileReader()
        reader.onload = (event) => {
        setUploadedImage(event.target?.result as string) // 미리보기용
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVerify = async () => {
    if (!uploadFile || !selectedFood) return

    const food = mockFoods.find((f) => f.id === selectedFood)
    if (!food) return

    setIsVerifying(true)
    setError(null)

    try {
      // ✅ 쿼리 파라미터 (텍스트 값들)
      const params = new URLSearchParams()
      params.set("user_id", "default_user")
      params.set("food_name", food.name)
      params.set("is_recommended", String(food.isRecommended)) // true/false
      // lat, lon은 백엔드 기본값 쓰면 되면 생략 가능 (대구)

      // ✅ 사진 파일 담기
      const formData = new FormData()
      formData.append("photo", uploadFile)

      // ✅ 백엔드로 요청
      const res = await api.postForm<FoodSelectResponse>(
        `/food/select?${params.toString()}`,
        formData,
      )

      // ✅ 응답으로 보상 정보 사용
      setVerificationResult({
        success: true,
        food: food.name,
        confidence: 92, // 지금은 그냥 고정/랜덤 값으로 두고,
        satietyGain: res.rewards.satiety_gain,
        friendshipGain: res.rewards.friendship_gain,
        expGain: res.rewards.exp_gain,
        message: res.message,
        levelUp: res.level_up,
      })
    } catch (err) {
      console.error(err)
      setError("사진 인증 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.")
    } finally {
      setIsVerifying(false)
    }
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
        <div
          onClick={() => fileInputRef.current?.click()}   // ✅ 클릭 시 파일 선택창 열기
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

        {/* ✅ 진짜 파일 인풋: 화면에서는 안 보이지만 ref로 클릭 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
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
            disabled={!selectedFood || !uploadFile || isVerifying}
            className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isVerifying ? "인증 중..." : "사진 인증하기"}
          </button>
          {error && (
            <p className="mt-2 text-sm text-red-500">
            {error}
            </p>
          )}
        </>
      )}
    </div>
  )
}
