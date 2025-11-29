"use client"

import { Card } from "@/components/ui/card"
import { Heart, Zap, Star } from "lucide-react"

interface Food {
  id: string
  name: string
  emoji: string
  isRecommended: boolean
}

interface RewardDisplayProps {
  food: Food
  reward: {
    satiety: number
    friendship: number
    exp: number
  }
}

export default function RewardDisplay({ food, reward }: RewardDisplayProps) {
  const reactions: Record<string, string> = {
    "1": "😋 맛있었어!",
    "2": "😐 괜찮네",
    "3": "🤔 그저그래",
    "4": "😋 맛있었어!",
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      <Card className="p-8 bg-white border-2 border-primary rounded-3xl shadow-2xl animate-bounce max-w-xs">
        <div className="text-center space-y-4">
          {/* 캐릭터 반응 */}
          <div className="text-6xl">{food.emoji}</div>

          <p className="text-lg font-bold text-primary">{reactions[food.id] || "😋 맛있었어!"}</p>

          {/* 리워드 표시 */}
          <div className="space-y-2 pt-4 border-t-2 border-primary/20">
            <div className="flex items-center justify-center gap-2 text-green-600 font-bold">
              <Zap size={20} />+{reward.satiety} 포만감
            </div>
            <div className="flex items-center justify-center gap-2 text-pink-600 font-bold">
              <Heart size={20} />+{reward.friendship} 친밀도
            </div>
            <div className="flex items-center justify-center gap-2 text-yellow-600 font-bold">
              <Star size={20} />+{reward.exp} 경험치
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
