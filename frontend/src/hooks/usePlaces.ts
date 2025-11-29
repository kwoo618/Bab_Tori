"use client"

import { useEffect, useState } from "react"
import { api } from "../lib/api"

export interface Place {
  id: string
  name: string
  address: string
  roadAddress: string | null
  y: string // 위도 (latitude)
  x: string // 경도 (longitude)
  distance_m?: number
  phone?: string | null
  placeUrl?: string | null
}

interface PlacesResponse {
  keyword: string
  count: number
  places: Array<{
    name: string
    category: string
    address: string
    road_address: string | null
    y: string // API는 위도를 y로 줌
    x: string // API는 경도를 x로 줌
    distance: number
    phone: string | null
    place_url: string | null
    is_mock?: boolean
  }>
}

export function usePlaces(foodName: string | null, lat?: number, lon?: number) {
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPlaces() {
      // API를 호출하기 직전에 모든 값이 유효한지 다시 확인합니다.
      if (!foodName || typeof lat !== "number" || typeof lon !== "number") {
        return
      }

      setLoading(true)
      setError(null)

      try {
        const resp = await api.get<PlacesResponse>(
          `/places?keyword=${encodeURIComponent(foodName)}&lat=${lat}&lon=${lon}&radius=1000`
        )

        const mapped: Place[] = resp.places.map((p, idx) => ({
          id: `${idx}`,
          name: p.name,
          address: p.address,
          roadAddress: p.road_address,
          y: p.y, // 위도
          x: p.x, // 경도
          distance_m: p.distance,
          phone: p.phone,
          placeUrl: p.place_url,
        }))

        setPlaces(mapped)
      } catch (e) {
        console.error(e)
        setError("맛집 정보를 불러올 수 없어요.")
      } finally {
        setLoading(false)
      }
    }

    fetchPlaces()
  }, [foodName, lat, lon])

  return { places, loading, error }
}