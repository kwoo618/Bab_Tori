"use client"

import { useState } from "react"
import { useFoodRecords } from "../hooks/useFoodRecords"
import { useCharacter } from "../hooks/useCharacter"
import FoodCard from "../components/FoodCard"
import RewardDisplay from "../components/RewardDisplay"
import { ChevronUp } from "lucide-react"

interface RecommendationScreenProps {
  onBack: () => void
}

export default function RecommendationScreen({ onBack }: RecommendationScreenProps) {
  const { mockFoods, addRecord } = useFoodRecords()
  const { character, updateStats } = useCharacter()
  const [selectedFood, setSelectedFood] = useState(null)
  const [showReward, setShowReward] = useState(false)
  const [reward, setReward] = useState(null)

  // 4개의 추천 음식 선택 (처음 4개 사용)
  const recommendedFoods = mockFoods.slice(0, 4)

  const handleFoodSelect = (food: any) => {
    const record = addRecord(food)
    updateStats(record.satietyGain, record.friendshipGain, record.expGain)

    setReward({
      food: food.name,
      satiety: record.satietyGain,
      friendship: record.friendshipGain,
      exp: record.expGain,
      isRecommended: food.isRecommended,
    })
    setShowReward(true)

    setTimeout(() => {
      setShowReward(false)
      onBack()
    }, 3000)
  }

  if (showReward && reward) {
    return <RewardDisplay reward={reward} />
  }

  return (
    <div className="max-w-2xl mx-auto p-4 py-10 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">오늘의 추천 음식</h1>
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
          <ChevronUp size={24} />
        </button>
      </div>

      {/* 안내 문구 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <p className="text-sm text-foreground">추천 음식을 선택하면 더 많은 보상을 얻어요!</p>
      </div>

      {/* 추천 음식 카드 */}
      <div className="grid grid-cols-2 gap-4">
        {recommendedFoods.map((food) => (
          <FoodCard key={food.id} food={food} onSelect={handleFoodSelect} isRecommended={food.isRecommended} />
        ))}
      </div>
    </div>
  )
}
