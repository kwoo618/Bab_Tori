"use client"

import { useState } from "react"
import { ArrowLeft, MapPin, Star, Navigation2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import PlacesList from "@/components/places-list"
import SimpleMap from "@/components/simple-map"

interface Place {
  id: string
  name: string
  type: string
  emoji: string
  rating: number
  distance: number
  latitude: number
  longitude: number
  address: string
}

interface PlacesScreenProps {
  onBack: () => void
}

const SAMPLE_PLACES: Place[] = [
  {
    id: "1",
    name: "미소 라멘",
    type: "라면",
    emoji: "🍜",
    rating: 4.8,
    distance: 0.3,
    latitude: 37.4979,
    longitude: 127.0276,
    address: "강남구 테헤란로 123",
  },
  {
    id: "2",
    name: "불고기 마을",
    type: "불고기",
    emoji: "🍖",
    rating: 4.6,
    distance: 0.5,
    latitude: 37.4959,
    longitude: 127.0296,
    address: "강남구 봉은사로 456",
  },
  {
    id: "3",
    name: "피자 나라",
    type: "피자",
    emoji: "🍕",
    rating: 4.5,
    distance: 0.7,
    latitude: 37.4999,
    longitude: 127.0256,
    address: "서초구 강남대로 789",
  },
  {
    id: "4",
    name: "김밥 천국",
    type: "김밥",
    emoji: "🍣",
    rating: 4.7,
    distance: 0.4,
    latitude: 37.4989,
    longitude: 127.0286,
    address: "강남구 역삼동 101",
  },
  {
    id: "5",
    name: "우동 야마",
    type: "우동",
    emoji: "🍜",
    rating: 4.4,
    distance: 0.6,
    latitude: 37.4969,
    longitude: 127.0266,
    address: "강남구 개포로 202",
  },
]

export default function PlacesScreen({ onBack }: PlacesScreenProps) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [mapView, setMapView] = useState(false)

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-4 pt-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between sticky top-4 z-10 bg-blue-50 rounded-lg p-2">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition">
          <ArrowLeft size={24} className="text-foreground" />
        </button>
        <h1 className="text-2xl font-bold text-primary">맛집 찾기</h1>
        <button onClick={() => setMapView(!mapView)} className="p-2 hover:bg-primary/10 rounded-lg transition">
          <Navigation2 size={24} className="text-primary" />
        </button>
      </div>

      {/* 검색/필터 영역 */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-0 rounded-2xl">
        <p className="text-sm text-foreground font-semibold mb-2">현재 위치 주변 맛집</p>
        <p className="text-xs text-muted-foreground">강남 테헤란로 중심, {SAMPLE_PLACES.length}개 식당 발견</p>
      </Card>

      {/* 지도 또는 리스트 보기 */}
      {mapView ? (
        <>
          {/* 간단한 지도 표현 */}
          <SimpleMap places={SAMPLE_PLACES} selectedPlace={selectedPlace} onSelectPlace={setSelectedPlace} />
        </>
      ) : (
        <>
          {/* 맛집 리스트 */}
          <PlacesList places={SAMPLE_PLACES} selectedPlace={selectedPlace} onSelectPlace={setSelectedPlace} />
        </>
      )}

      {/* 선택된 맛집 상세정보 */}
      {selectedPlace && (
        <Card className="p-4 rounded-2xl border-2 border-primary/30 bg-white sticky bottom-0">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="text-4xl">{selectedPlace.emoji}</div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{selectedPlace.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedPlace.type}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  <Star size={16} fill="currentColor" className="text-yellow-500" />
                  <span className="font-semibold text-yellow-600">{selectedPlace.rating}</span>
                </div>
                <p className="text-xs text-muted-foreground">{selectedPlace.distance}km</p>
              </div>
            </div>

            <div className="space-y-2 border-t pt-3">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <MapPin size={16} />
                {selectedPlace.address}
              </p>
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold">
              길찾기
            </Button>
          </div>
        </Card>
      )}

      {/* 돌아가기 */}
      {!selectedPlace && (
        <Button
          onClick={onBack}
          variant="outline"
          className="w-full h-12 font-semibold rounded-xl border-2 border-primary/30 text-primary hover:bg-primary/5 bg-transparent"
        >
          홈으로
        </Button>
      )}
    </div>
  )
}
