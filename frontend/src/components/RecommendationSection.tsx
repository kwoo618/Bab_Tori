"use client"

import { MessageCircle } from "lucide-react"

interface RecommendationSectionProps {
  onFoodSelect: (foodName: string) => void
  onOpenChat: () => void
  onOpenFoodModal: () => void  
}

export default function RecommendationSection({ onFoodSelect, onOpenChat, onOpenFoodModal, }: RecommendationSectionProps) {
  const recommendations = [
    {
      name: "김치찌개",
      reason: "얼큰함으로 추위를 날려요!",
      img: "https://placehold.co/200x150/f87171/ffffff?text=김치찌개",
    },
    {
      name: "해물파전",
      reason: "비 오는 날엔 역시 파전이죠!",
      img: "https://placehold.co/200x150/fbbf24/ffffff?text=해물파전",
    },
    {
      name: "따끈한 칼국수",
      reason: "속이 든든해져요.",
      img: "https://placehold.co/200x150/34d399/ffffff?text=칼국수",
    },
    { name: "수제비", reason: "쫀득한 식감이 일품!", img: "https://placehold.co/200x150/60a5fa/ffffff?text=수제비" },
  ]

  return (
    <section id="recommendation-section" className="mt-8">
      {/* Weather Widget */}
      <div className="flex items-center justify-between mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <p className="text-sm text-gray-500 mb-1">현재 위치: 서울시 강남구</p>
          <p className="font-bold text-lg text-gray-800">비 오는 날</p>
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="text-4xl mb-1">🌧️</div>
          <p className="text-sm font-semibold text-sky-600">19°C / 습도 85%</p>
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
      <div className="grid grid-cols-2 gap-4">
        {recommendations.map((food, index) => (
          <div
            key={index}
            className="food-card border border-gray-100 bg-white rounded-xl p-3 text-center shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between hover:scale-[1.02]"
          >
            <div onClick={() => onFoodSelect(food.name)}>
              <div className="overflow-hidden rounded-lg mb-3">
                <img
                  src={food.img || "/placeholder.svg"}
                  alt={food.name}
                  className="w-full h-24 object-cover transform hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h4 className="font-bold text-base text-gray-800 mb-1">{food.name}</h4>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{food.reason}</p>
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
