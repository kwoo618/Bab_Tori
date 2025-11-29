"use client"

import { useState } from "react"
import { ChevronUp, MapPin } from "lucide-react"
import KakaoMap from "../components/KakaoMap"
import { usePlaces, type Place } from "../hooks/usePlaces"
import { useGeolocation } from "../hooks/useGeolocation"

interface PlacesScreenProps {
  onBack: () => void
}

export default function PlacesScreen({ onBack }: PlacesScreenProps) {
  const { location, error: locationError, loading: locationLoading } = useGeolocation()
  const foodName = "맛집" // 추천된 음식 이름 대신 '맛집'으로 검색
  const { places, loading: placesLoading, error: placesError } = usePlaces(foodName, location?.lat, location?.lon)
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)

  const handleSelectPlace = (place: Place) => {
    setSelectedPlace(place)
    // 나중에 여기서 지도 중심 이동 같은 것도 연동 가능
  }

  return (
    <div className="p-4 py-10 space-y-6 min-h-[80vh]">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <MapPin className="text-primary" />
          맛집 찾기
        </h1>
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
        >
          <ChevronUp size={24} />
        </button>
      </div>

      {/* ✅ 카카오맵 영역 */}
      <div className="space-y-2">
        <h3 className="font-bold text-lg">지도</h3>
        {(locationLoading || placesLoading) && (
          <p className="text-sm text-muted-foreground">
            {locationLoading ? "현재 위치 파악 중..." : "주변 맛집 지도 불러오는 중..."}
          </p>
        )}
        {(locationError || placesError) && (
          <p className="text-sm text-red-500">
            {locationError || placesError}
          </p>
        )}

        <KakaoMap
          center={location ? { lat: location.lat, lon: location.lon } : { lat: 35.8714, lon: 128.6014 }}
          places={places || []}
        />
      </div>

      {/* ✅ 맛집 리스트 (백엔드 /places 데이터 사용) */}
      <div className="space-y-3">
        <h3 className="font-bold text-lg">내 주변 맛집</h3>

        {(locationLoading || placesLoading) && (
          <p className="text-sm text-muted-foreground">
            맛집 목록 불러오는 중...
          </p>
        )}

        {!placesLoading && places.length === 0 && !placesError && (
          <p className="text-sm text-muted-foreground">
            주변에서 맛집을 찾지 못했어요 😢
          </p>
        )}

        {places.map((place) => (
          <button
            key={place.id}
            type="button"
            onClick={() => handleSelectPlace(place)}
            className={`w-full p-4 rounded-xl text-left transition-all cursor-pointer border ${
              selectedPlace?.id === place.id
                ? "bg-primary/5 border-primary shadow-sm"
                : "bg-white border-transparent shadow-sm hover:shadow-md"
            }`}
          >
            <div className="flex items-start gap-3">
              {/* 이모지는 아직 API에 없어서 고정 아이콘 사용 */}
              <span className="text-3xl bg-gray-100 p-2 rounded-lg">
                🍽️
              </span>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{place.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {(place.roadAddress || place.address) ?? "주소 정보 없음"}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  {typeof place.distance_m === "number" && (
                    <span>
                      {place.distance_m < 1000
                        ? `${place.distance_m}m`
                        : `${(place.distance_m / 1000).toFixed(1)}km`}
                    </span>
                  )}
                  {place.phone && <span>· {place.phone}</span>}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}