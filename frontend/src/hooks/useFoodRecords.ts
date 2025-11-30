"use client"

import { useEffect, useState } from "react"
import { api } from "../lib/api"
import type { Food, FoodRecord } from "../types"

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"

interface FoodDiaryItemApi {
  id: number
  user_id: string
  food_name: string
  category: string | null
  is_recommended: boolean
  created_at: string
  photo_url?: string | null
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
          const food: Food = {
            id: String(item.id), // 음식 자체의 ID가 없으므로 기록 ID를 사용
            name: item.food_name,
            // ✅ 백엔드에서 내려준 카테고리 사용, 없으면 '기타'
            category: item.category ?? "기타",
            emoji: "🍚",
            isRecommended: item.is_recommended,
            description: "",
          }

          return {
            id: String(item.id),
            food,
            photoUrl: item.photo_url
              ? `${API_BASE}${item.photo_url}`
              : undefined,
            timestamp: new Date(item.created_at),
            // 필요하면 나중에 백엔드 값으로 바꿀 수 있음
            satietyGain: 0,
            expGain: 0,
            friendshipGain: 0,
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
    records,
    addRecord,
    loading,
    error,
  }
}
