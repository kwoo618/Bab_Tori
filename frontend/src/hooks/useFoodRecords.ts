"use client"

import { useState } from "react"
import type { FoodRecord, Food } from "../types"

const MOCK_FOODS: Food[] = [
  { id: "1", name: "불고기", category: "한식", emoji: "🍖", isRecommended: true, description: "한우 불고기" },
  { id: "2", name: "라면", category: "한식", emoji: "🍜", isRecommended: false, description: "신라면" },
  { id: "3", name: "초밥", category: "일식", emoji: "🍣", isRecommended: true, description: "참치 오타마" },
  { id: "4", name: "짜장면", category: "중식", emoji: "🍲", isRecommended: false, description: "검은콩 짜장면" },
]

export function useFoodRecords() {
  const [records, setRecords] = useState<FoodRecord[]>([])

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

  return { records, addRecord, mockFoods: MOCK_FOODS }
}
