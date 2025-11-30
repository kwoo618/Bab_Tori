"use client"

import { MessageCircle } from "lucide-react"
import { useWeather } from "../hooks/useWeather"
import { useRecommendations } from "../hooks/useRecommendations"  // ✅ 추가
import type { Food } from "../types" // 만약 types.ts 파일을 새로 만들었다면, 이 경로를 './types' 등으로 맞춰주세요.

interface RecommendationSectionProps {
  onFoodSelect: (foodName: string) => void
  onOpenChat: () => void
  onOpenFoodModal: () => void  
}

export default function RecommendationSection({ onFoodSelect, onOpenChat, onOpenFoodModal, }: RecommendationSectionProps) {
  const { weather,loading: weatherLoading,error: weatherError,} = useWeather()
  const {foods,loading: recLoading,error: recError,} = useRecommendations()

  // ✅ 백엔드 서버 주소 정의 (환경 변수로 관리하는 것이 가장 좋습니다)
  const BACKEND_URL = "http://localhost:8000";

  return (
    <section id="recommendation-section" className="mt-8">
      {/* Weather Widget */}
      <div className="flex items-center justify-between mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <p className="text-sm text-gray-500 mb-1">
            현재 위치: {weather?.location ?? "불러오는 중..."}
          </p>

          <p className="font-bold text-lg text-gray-800">
            {weatherLoading && "날씨 불러오는 중..."}
            {weatherError && !weatherLoading && "날씨 정보를 불러올 수 없어요"}
            {!weatherLoading && !weatherError && weather && weather.description}
          </p>
        </div>

        <div className="text-right flex flex-col items-end">
          <div className="text-4xl mb-1">
            {weather?.icon ?? "☁️"}
          </div>
          <p className="text-sm font-semibold text-sky-600">
            {weather
              ? `${Math.round(weather.temp)}°C / 습도 ${weather.humidity}%`
              : "–°C / 습도 –%"}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center">
          <span className="mr-2">🍽️</span> 밥토리의 추천!
        </h3>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenFoodModal}
          className="flex items-center gap-2 bg-sky-100 text-sky-700 px-3 py-2 rounded-full text-sm font-semibold hover:bg-sky-200 transition-colors shadow-sm"
        >
          <span>음식 기록하기</span>
        </button>
          <button
            type="button"
            onClick={onOpenChat}
            className="flex items-center gap-2 bg-sky-100 text-sky-700 px-3 py-2 rounded-full text-sm font-semibold hover:bg-sky-200 transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>다른 메뉴?</span>
          </button>
        </div>
      </div>

      {/* 추천 로딩/에러 상태 */}
      {recLoading && (
        <p className="text-sm text-gray-500 mb-2">추천 불러오는 중...</p>
      )}

      {recError && !recLoading && (
        <p className="text-sm text-red-500 mb-2">{recError}</p>
      )}
            <div className="grid grid-cols-2 gap-4">
        {!recLoading && !recError && foods.map((food, index) => (
          <div
            key={food.id ?? index}
            className="food-card border border-gray-100 bg-white rounded-xl p-3 text-center shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between hover:scale-[1.02]"
          >
            <div onClick={() => onFoodSelect(food.name)}>
              <div className="overflow-hidden rounded-lg mb-3">
                <img
                  src={food.imageUrl ? `${BACKEND_URL}${food.imageUrl}` : "/placeholder.svg"}
                  alt={food.name}
                  className="w-full h-24 object-cover transform hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h4 className="font-bold text-base text-gray-800 mb-1">
                {food.name}
              </h4>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                {food.description}
              </p>
            </div>
            <button
              onClick={() => onFoodSelect(food.name)}
              className="mt-auto w-full bg-amber-400 hover:bg-amber-500 text-white font-bold py-2 px-2 rounded-lg text-sm transition-colors shadow-sm"
            >
              이거 먹을래!
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
