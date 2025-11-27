"use client"

import { useEffect, useState } from "react"
import { api } from "../lib/api"
import type { Food } from "../types"

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

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setLoading(true)
        setError(null)

        const data = await api.get<RecommendResponse>("/food/recommend")

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
  }, [])

  return { foods, loading, error }
}