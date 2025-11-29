"use client"

import { useState } from "react"
import { ArrowLeft, Camera, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import UploadArea from "@/components/upload-area"
import VerificationResult from "@/components/verification-result"

interface UploadScreenProps {
  onBack: () => void
}

export default function UploadScreen({ onBack }: UploadScreenProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verification, setVerification] = useState<{
    success: boolean
    foodName: string
    confidence: number
  } | null>(null)

  const handleFileSelect = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleVerify = () => {
    setIsVerifying(true)

    // 시뮬레이션: 2초 후 인증 결과 반환
    setTimeout(() => {
      const foods = ["불고기", "라면", "김밥", "피자", "햄버거", "우동"]
      const randomFood = foods[Math.floor(Math.random() * foods.length)]
      const randomConfidence = Math.floor(Math.random() * 30) + 70

      setVerification({
        success: true,
        foodName: randomFood,
        confidence: randomConfidence,
      })
      setIsVerifying(false)
    }, 2000)
  }

  const handleConfirm = () => {
    // 도감에 추가되고 리워드 지급
    setUploadedImage(null)
    setVerification(null)
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6 pt-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition">
          <ArrowLeft size={24} className="text-foreground" />
        </button>
        <h1 className="text-2xl font-bold text-primary">음식 인증</h1>
        <div className="w-10" />
      </div>

      {/* 단계 표시 */}
      <div className="flex items-center justify-between">
        <div className={`flex-1 h-2 rounded-full ${uploadedImage ? "bg-primary" : "bg-gray-300"}`} />
        <span className="mx-2 text-sm font-semibold text-primary">
          {uploadedImage ? (verification ? "3/3" : "2/3") : "1/3"}
        </span>
        <div className={`flex-1 h-2 rounded-full ${verification ? "bg-primary" : "bg-gray-300"}`} />
      </div>

      {!uploadedImage ? (
        <>
          {/* 안내 텍스트 */}
          <Card className="p-4 bg-blue-50 border-blue-200 rounded-xl">
            <p className="text-sm text-blue-900">
              오늘 먹은 음식 사진을 업로드해주세요! AI가 음식을 인식하고 도감에 추가해드려요.
            </p>
          </Card>

          {/* 업로드 영역 */}
          <UploadArea onFileSelect={handleFileSelect} />

          {/* 안내 사항 */}
          <Card className="p-4 bg-gray-50 border-gray-200 rounded-xl space-y-2">
            <p className="text-sm font-semibold text-foreground">팁:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 밝은 조명에서 촬영해주세요</li>
              <li>• 음식이 화면 중앙에 위치하게 해주세요</li>
              <li>• 음식이 명확하게 보이도록 해주세요</li>
            </ul>
          </Card>
        </>
      ) : !verification ? (
        <>
          {/* 업로드된 이미지 미리보기 */}
          <Card className="p-4 rounded-2xl overflow-hidden border-2 border-primary/20">
            <img
              src={uploadedImage || "/placeholder.svg"}
              alt="업로드된 음식"
              className="w-full h-64 object-cover rounded-xl"
            />
          </Card>

          {/* 인증 진행 중 또는 버튼 */}
          <div className="space-y-3">
            {isVerifying ? (
              <div className="p-6 bg-primary/10 rounded-2xl text-center">
                <div className="inline-block animate-spin mb-3">
                  <Camera size={32} className="text-primary" />
                </div>
                <p className="text-primary font-semibold">음식을 인식 중이에요...</p>
              </div>
            ) : (
              <>
                <Button
                  onClick={handleVerify}
                  className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white rounded-xl font-semibold"
                >
                  <Check size={20} className="mr-2" />
                  음식 인증하기
                </Button>
                <Button
                  onClick={() => setUploadedImage(null)}
                  variant="outline"
                  className="w-full h-12 border-2 border-primary/30 text-primary hover:bg-primary/5 rounded-xl font-semibold"
                >
                  다시 선택
                </Button>
              </>
            )}
          </div>
        </>
      ) : (
        <VerificationResult verification={verification} onConfirm={handleConfirm} />
      )}

      {/* 하단 버튼 */}
      {!uploadedImage && (
        <Button
          onClick={onBack}
          variant="outline"
          className="w-full h-12 font-semibold rounded-xl border-2 border-primary/30 text-primary hover:bg-primary/5 bg-transparent"
        >
          돌아가기
        </Button>
      )}
    </div>
  )
}
