"use client"

import { Card } from "@/components/ui/card"

interface Place {
  id: string
  name: string
  emoji: string
  latitude: number
  longitude: number
}

interface SimpleMapProps {
  places: Place[]
  selectedPlace: Place | null
  onSelectPlace: (place: Place) => void
}

export default function SimpleMap({ places, selectedPlace, onSelectPlace }: SimpleMapProps) {
  // 간단한 그리드 기반 지도 표현
  const getPosition = (place: Place, index: number) => {
    // 현재 위치를 기준으로 위치 계산 (시뮬레이션)
    const positions = [
      { top: "20%", left: "30%" },
      { top: "40%", left: "60%" },
      { top: "60%", left: "20%" },
      { top: "35%", left: "75%" },
      { top: "70%", left: "50%" },
    ]
    return positions[index] || { top: "50%", left: "50%" }
  }

  return (
    <Card className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 relative h-96 overflow-hidden">
      {/* 지도 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 opacity-50" />

      {/* 현재 위치 마커 (중앙) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-5 h-5 bg-primary rounded-full border-2 border-white shadow-lg animate-pulse" />
        <div className="absolute inset-0 bg-primary rounded-full opacity-20 animate-ping" />
      </div>

      {/* 식당 마커 */}
      {places.map((place, index) => {
        const isSelected = selectedPlace?.id === place.id
        const position = getPosition(place, index)

        return (
          <button
            key={place.id}
            onClick={() => onSelectPlace(place)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-125 z-10 focus:outline-none"
            style={{
              top: position.top,
              left: position.left,
            }}
          >
            <div
              className={`text-3xl filter drop-shadow-lg transition-all ${
                isSelected ? "scale-125 drop-shadow-2xl" : ""
              }`}
            >
              {place.emoji}
            </div>

            {/* 선택 시 레이블 표시 */}
            {isSelected && (
              <div className="absolute top-full mt-2 bg-white px-2 py-1 rounded-lg shadow-lg whitespace-nowrap text-xs font-bold text-foreground">
                {place.name}
              </div>
            )}
          </button>
        )
      })}

      {/* 범례 */}
      <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur px-3 py-2 rounded-lg text-xs">
        <p className="font-semibold text-foreground mb-1">범례</p>
        <div className="flex gap-4 text-xs">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-primary rounded-full" /> 현재 위치
          </span>
          <span className="flex items-center gap-1">
            <span className="text-xl">🍜</span> 맛집
          </span>
        </div>
      </div>
    </Card>
  )
}
