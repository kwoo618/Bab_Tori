"use client"

import type React from "react"
import { useState, useRef } from "react"
import { ArrowLeft, Camera, MapPin } from "lucide-react"
import { api } from "../lib/api"

interface InteractionSectionProps {
  selectedFood: string
  onBack: () => void
  hidePlaces?: boolean
}

interface FoodSelectResponse {
  message: string
  character_emoji: string
  rewards: {
    satiety_gain: number
    friendship_gain: number
    exp_gain: number
  }
  character: any
  level_up: boolean
}

type VerificationResult = {
  satietyGain: number
  friendshipGain: number
  expGain: number
  message: string
  levelUp: boolean
}

export default function InteractionSection({
  selectedFood,
  onBack,
  hidePlaces = false,
}: InteractionSectionProps) {
  const [activeTab, setActiveTab] = useState<"map" | "upload">(
    hidePlaces ? "upload" : "map",
  )

  // ✅ 사진 인증용 상태들
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // 파일 선택 시
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadFile(file)
    setVerificationResult(null)
    setError(null)

    const reader = new FileReader()
    reader.onload = (ev) => {
      setUploadedImage(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  // 사진 인증 버튼 눌렀을 때
  const handleVerify = async () => {
    if (!uploadFile) return

    setIsVerifying(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      params.set("user_id", "default_user")
      params.set("food_name", selectedFood)
      // 일단 추천 음식인 걸로 처리 (필요하면 나중에 실제 값 넘기기)
      params.set("is_recommended", "true")

      const formData = new FormData()
      formData.append("photo", uploadFile)

      const res = await api.postForm<FoodSelectResponse>(
        `/food/select?${params.toString()}`,
        formData,
      )

      setVerificationResult({
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

  return (
    <section
      id="interaction-section"
      className="border rounded-xl overflow-hidden bg-white shadow-sm mt-4 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
    >
      <div className="p-4 border-b flex items-center relative bg-gray-50">
        <button
          onClick={onBack}
          className="text-sky-600 hover:text-sky-800 p-1 rounded-full hover:bg-sky-50 transition-colors absolute left-4"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h4 className="font-bold text-center flex-1 text-lg">
          {hidePlaces || activeTab === "upload"
            ? "오늘 먹은 음식 인증하기"
            : "선택한 메뉴 주변 맛집!"}
        </h4>
      </div>

      <div className="p-4 min-h-[300px]">
        {/* 탭 컨트롤 */}
        <div className="flex mb-4 bg-gray-100 p-1 rounded-lg">
          {!hidePlaces && (
            <button
              onClick={() => setActiveTab("map")}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                activeTab === "map"
                  ? "bg-white shadow text-sky-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              맛집 찾기
            </button>
          )}

          <button
            onClick={() => setActiveTab("upload")}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              activeTab === "upload"
                ? "bg-white shadow text-sky-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            음식 인증
          </button>
        </div>

        {/* Map Content */}
        {!hidePlaces && activeTab === "map" && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-gray-200 h-64 rounded-xl flex flex-col items-center justify-center overflow-hidden relative group cursor-pointer">
              <img
                src="https://placehold.co/600x400/e2e8f0/64748b?text=지도+API+연동+예정"
                alt="Map Placeholder"
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="bg-white/90 px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-600" />
                  <span className="text-sm font-bold text-gray-700">
                    {selectedFood} 맛집 검색중...
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Content */}
        {activeTab === "upload" && (
          <div className="animate-in fade-in duration-300">
            <p className="text-sm text-gray-500 mb-4 text-center">
              밥토리의 행복도와 친밀도가 올라가요!
            </p>

            {/* 업로드 박스 */}
            <div
              className="border-2 border-dashed border-sky-200 bg-sky-50 hover:bg-sky-100 transition-colors rounded-xl p-8 text-center cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadedImage ? (
                <>
                  <img
                    src={uploadedImage}
                    alt="uploaded"
                    className="w-full max-h-64 object-cover rounded-lg mb-3"
                  />
                  <p className="text-sky-700 font-semibold mb-1">
                    사진을 다시 선택하려면 클릭하세요
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                    <Camera className="w-8 h-8 text-sky-400" />
                  </div>
                  <p className="text-sky-700 font-semibold mb-1">
                    사진을 업로드해주세요
                  </p>
                  <p className="text-sky-400 text-xs">또는 여기로 드래그하세요</p>
                </>
              )}
            </div>

            {/* 숨겨진 파일 인풋 */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* 인증 버튼 & 에러 메시지 */}
            {uploadFile && (
              <div className="mt-4 space-y-2">
                <button
                  onClick={handleVerify}
                  disabled={isVerifying}
                  className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white font-bold py-2.5 rounded-xl transition-colors"
                >
                  {isVerifying ? "인증 중..." : "사진 인증하기"}
                </button>
                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}
              </div>
            )}

            {/* 인증 결과 표시 */}
            {verificationResult && (
              <div className="mt-6 bg-white border rounded-xl p-4 space-y-3 shadow-sm">
                <p className="font-semibold text-center">사진 인증 완료!</p>
                <p className="text-sm text-gray-500 text-center">
                  {verificationResult.message}
                </p>
                <div className="grid grid-cols-3 gap-2 text-center text-sm mt-2">
                  <div>
                    <p className="text-gray-500">포만감</p>
                    <p className="font-bold text-amber-500">
                      +{verificationResult.satietyGain}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">친밀도</p>
                    <p className="font-bold text-pink-500">
                      +{verificationResult.friendshipGain}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">경험치</p>
                    <p className="font-bold text-emerald-600">
                      +{verificationResult.expGain}
                    </p>
                  </div>
                </div>
                {verificationResult.levelUp && (
                  <p className="text-center text-amber-500 font-semibold mt-1">
                    레벨 업! 🎉
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
