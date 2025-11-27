"use client"

import { useEffect, useState } from "react"
import { api } from "../lib/api"
import type { Food, FoodRecord } from "../types"

const MOCK_FOODS: Food[] = [
  { id: "1", name: "불고기", category: "한식", emoji: "🍖", isRecommended: true, description: "한우 불고기" },
  { id: "2", name: "라면", category: "한식", emoji: "🍜", isRecommended: false, description: "신라면" },
  { id: "3", name: "초밥", category: "일식", emoji: "🍣", isRecommended: true, description: "참치 오타마" },
  { id: "4", name: "짜장면", category: "중식", emoji: "🍲", isRecommended: false, description: "검은콩 짜장면" },
]

interface FoodDiaryItemApi {
  id: number
  user_id: string
  food_name: string
  is_recommended: boolean
  created_at: string
  image_url?: string | null
  place_name?: string | null
}

export function useFoodRecords(userId: string = "default_user") {
  const [records, setRecords] = useState<FoodRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDiary() {
      try {
        setLoading(true)
        setError(null)

        // ✅ 백엔드에서 기록 목록 가져오기
        const res = await api.get<{
        user_id: string
        total_count: number
        records: FoodDiaryItemApi[]
      }>(`/food/diary?user_id=${userId}`)

        // ✅ 프론트에서 쓰기 편한 형태로 변환
        const mapped: FoodRecord[] = res.records.map((item) => {
        // 기록의 음식 이름과 MOCK_FOODS를 매칭해보고,
        // 없으면 임시 Food 객체를 만들어서 채워줌
        const found = MOCK_FOODS.find((f) => f.name === item.food_name)
        const food: Food =
          found ??
          {
            id: String(item.id),
            name: item.food_name,
            category: "기타",
            emoji: "🍚",
            isRecommended: item.is_recommended,
            description: "",
          }

        return {
          id: String(item.id),
          food,
          photoUrl: item.image_url ?? undefined,
          timestamp: new Date(item.created_at),
          satietyGain: 0,        // 백엔드에서 값 안 주면 일단 0으로
          expGain: 0,            // 필요하면 나중에 수정
          friendshipGain: 0,     // 필요하면 나중에 수정
        }
      })

        setRecords(mapped)
      } catch (e) {
        console.error(e)
        setError("음식 기록을 불러올 수 없어요")
      } finally {
        setLoading(false)
      }
    }

    fetchDiary()
  }, [userId])


  const addRecord = (food: Food, photoUrl?: string) => {
    const newRecord: FoodRecord = {
      id: Date.now().toString(),
      food,
      photoUrl,
      timestamp: new Date(),
      satietyGain: 40,
      expGain: food.isRecommended ? 50 : 10,
      friendshipGain: food.isRecommended ? 20 : 5,
    }
    setRecords((prev) => [newRecord, ...prev])
    return newRecord
  }

  return {
    mockFoods: MOCK_FOODS,
    records,
    addRecord,
    loading,
    error,
  }
}
