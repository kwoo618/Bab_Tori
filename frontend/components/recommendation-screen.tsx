"use client"

import { useState } from "react"
import { ArrowLeft, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import FoodCard from "@/components/food-card"
import RewardDisplay from "@/components/reward-display"
import { Card } from "@/components/ui/card"

interface Food {
  id: string
  name: string
  emoji: string
  category: string
  isRecommended: boolean
  description: string
}

interface RecommendationScreenProps {
  onBack: () => void
}

const FOODS: Food[] = [
  {
    id: "1",
    name: "불고기",
    emoji: "🍖",
    category: "한식",
    isRecommended: true,
    description: "오늘 날씨에 딱 맞아!",
  },
  {
    id: "2",
    name: "라면",
    emoji: "🍜",
    category: "분식",
    isRecommended: false,
    description: "즐겨찾는 음식",
  },
  {
    id: "3",
    name: "김밥",
    emoji: "🍣",
    category: "한식",
    isRecommended: false,
    description: "건강한 한끼",
  },
  {
    id: "4",
    name: "피자",
    emoji: "🍕",
    category: "양식",
    isRecommended: false,
    description: "친구들과 함께",
  },
]

export default function RecommendationScreen({ onBack }: RecommendationScreenProps) {
  const [selectedFood, setSelectedFood] = useState<Food | null>(null)
  const [showReward, setShowReward] = useState(false)
  const [reward, setReward] = useState({ satiety: 0, friendship: 0, exp: 0 })

  const handleSelectFood = (food: Food) => {
    const satietyGain = 40
    const friendshipGain = food.isRecommended ? 20 : 5
    const expGain = food.isRecommended ? 50 : 10

    setReward({ satiety: satietyGain, friendship: friendshipGain, exp: expGain })
    setSelectedFood(food)
    setShowReward(true)

    setTimeout(() => {
      setShowReward(false)
      setSelectedFood(null)
    }, 3000)
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6 pt-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition">
          <ArrowLeft size={24} className="text-foreground" />
        </button>
        <h1 className="text-2xl font-bold text-primary">오늘의 추천</h1>
        <div className="w-10" />
      </div>

      {/* 날씨 기반 추천 정보 */}
      <Card className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 rounded-2xl">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-orange-700">☀️ 맑은 날씨</span>에 어울리는 음식들을 추천했어요!
        </p>
      </Card>

      {/* 리워드 표시 */}
      {showReward && selectedFood && <RewardDisplay food={selectedFood} reward={reward} />}

      {/* 음식 카드 그리드 */}
      <div className="grid grid-cols-2 gap-4">
        {FOODS.map((food) => (
          <FoodCard key={food.id} food={food} isSelected={selectedFood?.id === food.id} onSelect={handleSelectFood} />
        ))}
      </div>

      {/* 추천 안내 */}
      <Card className="p-4 bg-blue-50 border-blue-200 rounded-xl">
        <div className="flex items-start gap-3">
          <Heart size={20} className="text-primary mt-1 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-semibold text-blue-900">추천 음식 선택 시</p>
            <p className="text-blue-800">포만감 +40, 친밀도 +20, 경험치 +50</p>
          </div>
        </div>
      </Card>

      {/* 다시 추천받기 버튼 */}
      <Button
        onClick={onBack}
        variant="outline"
        className="w-full h-12 font-semibold rounded-xl border-2 border-primary/30 text-primary hover:bg-primary/5 bg-transparent"
      >
        홈으로 돌아가기
      </Button>
    </div>
  )
}
