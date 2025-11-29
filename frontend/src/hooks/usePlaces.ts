"use client"

import { useEffect, useState } from "react"
import { api } from "../lib/api"

export interface Place {
  id: string
  name: string
  address: string
  roadAddress?: string | null
  lat: number
  lon: number
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
    latitude: number
    longitude: number
    distance: number
    phone: string | null
    place_url: string | null
    is_mock?: boolean
  }>
}

export function usePlaces(foodName: string | null, lat: number, lon: number) {
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!lat || !lon) return

    async function fetchPlaces() {
      setLoading(true)
      setError(null)

      try {
        const resp = await api.get<PlacesResponse>(
          `/places?keyword=${encodeURIComponent(foodName || "맛집")}&lat=${lat}&lon=${lon}&radius=1000`
        )

        const mapped: Place[] = resp.places.map((p, idx) => ({
          id: `${idx}`,
          name: p.name,
          address: p.address,
          roadAddress: p.road_address,
          lat: p.latitude,
          lon: p.longitude,
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