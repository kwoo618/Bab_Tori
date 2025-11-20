"use client"

import { useState } from "react"
import { ChevronUp, MapPin } from "lucide-react"

interface PlacesScreenProps {
  onBack: () => void
}

// 샘플 맛집 데이터 (협업자가 DB 연동 시 교체)
const MOCK_PLACES = [
  {
    id: 1,
    name: "맛있는 불고기",
    category: "한식",
    emoji: "🍖",
    rating: 4.8,
    distance: "0.3km",
    address: "서울 종로구",
  },
  {
    id: 2,
    name: "신라면 뜨거운집",
    category: "한식",
    emoji: "🍜",
    rating: 4.5,
    distance: "0.5km",
    address: "서울 종로구",
  },
  {
    id: 3,
    name: "신선한 초밥",
    category: "일식",
    emoji: "🍣",
    rating: 4.9,
    distance: "0.4km",
    address: "서울 중구",
  },
]

export default function PlacesScreen({ onBack }: PlacesScreenProps) {
  const [selectedPlace, setSelectedPlace] = useState<(typeof MOCK_PLACES)[0] | null>(null)

  return (
    <div className="p-4 py-10 space-y-6 min-h-[80vh]">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <MapPin className="text-primary" />
          맛집 찾기
        </h1>
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
          <ChevronUp size={24} />
        </button>
      </div>

      {/* 카카오맵 영역 (협업자 구현) */}
      <div className="w-full h-64 bg-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-300">
        <MapPin size={48} className="mb-2 opacity-50" />
        <p className="font-semibold">지도 영역 (카카오맵)</p>
        <p className="text-xs mt-1">협업자가 API 연동 예정</p>
      </div>

      {/* 맛집 리스트 */}
      <div className="space-y-3">
        <h3 className="font-bold text-lg">내 주변 맛집</h3>
        {MOCK_PLACES.map((place) => (
          <div
            key={place.id}
            onClick={() => setSelectedPlace(place)}
            className={`w-full p-4 rounded-xl text-left transition-all cursor-pointer border ${
              selectedPlace?.id === place.id
                ? "bg-primary/5 border-primary shadow-sm"
                : "bg-white border-transparent shadow-sm hover:shadow-md"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl bg-gray-100 p-2 rounded-lg">{place.emoji}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{place.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {place.category} · {place.distance}
                </p>
                <div className="flex items-center gap-1 mt-1 text-amber-500 font-medium">⭐ {place.rating}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
