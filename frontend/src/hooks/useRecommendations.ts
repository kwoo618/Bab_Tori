"use client"

import { useEffect, useState } from "react"
import type { Food, WeatherData } from "../types"
import { useGeolocation } from "./useGeolocation"
import { useWeather } from "./useWeather"
import { api } from "../lib/api"

interface RecommendResponse {
  weather: any
  character: {
    level: number
    satiety: number
    friendship: number
  }
  recommendations: {
    name: string
    reason: string
    category: string | null
    ingredients: string | null
    is_weather_based: boolean
    is_random: boolean
  }[]
}

export function useRecommendations() {
  const [foods, setFoods] = useState<Food[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { location, loading: locationLoading } = useGeolocation()
  const { weather, loading: weatherLoading, error: weatherError } = useWeather() // 이제 인자 없이 호출

  useEffect(() => {
    if (locationLoading) return // 위치 정보를 가져올 때까지 대기

    async function fetchRecommendations() {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()
        if (location) {
          params.set("lat", String(location.lat))
          params.set("lon", String(location.lon))
        }
        const data = await api.get<RecommendResponse>(`/food/recommend?${params.toString()}`)

        const mapped: Food[] = data.recommendations.map((item, index) => ({
          id: String(index + 1),
          name: item.name,
          category: item.category ?? "기타",
          emoji: "🍚", // 나중에 카테고리별로 이모지 바꿔도 됨
          isRecommended: true,
          description: item.reason,
        }))

        setFoods(mapped)
      } catch (err) {
        console.error(err)
        setError("추천을 불러오는 중 오류가 발생했어요.")
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [location]) // location이 변경되면 추천을 다시 가져옴

  return { foods, weather, loading: loading || locationLoading || weatherLoading, error: error || weatherError }
}