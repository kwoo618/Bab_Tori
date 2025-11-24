"use client"

import { useState } from "react"
import { ArrowLeft, Camera, MapPin } from "lucide-react"

interface InteractionSectionProps {
  selectedFood: string
  onBack: () => void
}

export default function InteractionSection({ selectedFood, onBack }: InteractionSectionProps) {
  const [activeTab, setActiveTab] = useState<"map" | "upload">("map")

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
          {activeTab === "map" ? "선택한 메뉴 주변 맛집!" : "오늘 먹은 음식 인증하기"}
        </h4>
      </div>

      <div className="p-4 min-h-[300px]">
        {/* 탭 컨트롤 */}
        <div className="flex mb-4 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("map")}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === "map" ? "bg-white shadow text-sky-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            맛집 찾기
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === "upload" ? "bg-white shadow text-sky-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            음식 인증
          </button>
        </div>

        {/* Map Content */}
        {activeTab === "map" && (
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
                  <span className="text-sm font-bold text-gray-700">{selectedFood} 맛집 검색중...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Content */}
        {activeTab === "upload" && (
          <div className="animate-in fade-in duration-300">
            <p className="text-sm text-gray-500 mb-4 text-center">밥토리의 행복도와 친밀도가 올라가요!</p>
            <div className="border-2 border-dashed border-sky-200 bg-sky-50 hover:bg-sky-100 transition-colors rounded-xl p-8 text-center cursor-pointer group">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                <Camera className="w-8 h-8 text-sky-400" />
              </div>
              <p className="text-sky-700 font-semibold mb-1">사진을 업로드해주세요</p>
              <p className="text-sky-400 text-xs">또는 여기로 드래그하세요</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
