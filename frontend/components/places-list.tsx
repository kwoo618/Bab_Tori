"use client"

import { Card } from "@/components/ui/card"
import { Star, MapPin } from "lucide-react"

interface Place {
  id: string
  name: string
  type: string
  emoji: string
  rating: number
  distance: number
  address: string
}

interface PlacesListProps {
  places: Place[]
  selectedPlace: Place | null
  onSelectPlace: (place: Place) => void
}

export default function PlacesList({ places, selectedPlace, onSelectPlace }: PlacesListProps) {
  return (
    <div className="space-y-3">
      {places.map((place) => (
        <Card
          key={place.id}
          onClick={() => onSelectPlace(place)}
          className={`p-4 rounded-2xl cursor-pointer transition-all transform hover:scale-102 ${
            selectedPlace?.id === place.id
              ? "border-2 border-primary bg-primary/5 shadow-lg"
              : "border-gray-200 hover:border-primary/50"
          }`}
        >
          <div className="flex items-start gap-3">
            {/* 음식 이모지 */}
            <div className="text-3xl flex-shrink-0">{place.emoji}</div>

            {/* 정보 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-foreground truncate">{place.name}</h3>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Star size={14} fill="currentColor" className="text-yellow-500" />
                  <span className="text-sm font-semibold text-yellow-600">{place.rating}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-2">{place.type}</p>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin size={14} />
                <span className="truncate">{place.address}</span>
              </div>

              <p className="text-xs font-semibold text-primary mt-2">{place.distance}km 떨어짐</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
