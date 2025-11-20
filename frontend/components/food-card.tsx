"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Star } from "lucide-react"

interface Food {
  id: string
  name: string
  emoji: string
  category: string
  isRecommended: boolean
  description: string
}

interface FoodCardProps {
  food: Food
  isSelected: boolean
  onSelect: (food: Food) => void
}

export default function FoodCard({ food, isSelected, onSelect }: FoodCardProps) {
  return (
    <Card
      className={`p-4 rounded-2xl cursor-pointer transition-all transform hover:scale-105 border-2 ${
        isSelected ? "border-primary bg-primary/10 scale-105" : "border-gray-200 hover:border-primary/50"
      } ${food.isRecommended ? "ring-2 ring-offset-2 ring-accent" : ""}`}
      onClick={() => onSelect(food)}
    >
      <div className="space-y-3">
        {/* 추천 배지 */}
        {food.isRecommended && (
          <div className="flex items-center gap-1 bg-accent/20 text-accent px-2 py-1 rounded-lg w-fit">
            <Star size={14} fill="currentColor" />
            <span className="text-xs font-bold">추천</span>
          </div>
        )}

        {/* 음식 이모지 */}
        <div className="text-5xl text-center">{food.emoji}</div>

        {/* 음식명 */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-foreground">{food.name}</h3>
          <p className="text-xs text-muted-foreground">{food.category}</p>
        </div>

        {/* 설명 */}
        <p className="text-sm text-center text-gray-600">{food.description}</p>

        {/* 선택 버튼 */}
        <Button
          className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white rounded-lg font-semibold"
          onClick={(e) => {
            e.stopPropagation()
            onSelect(food)
          }}
        >
          {isSelected ? (
            <>
              <Check size={18} className="mr-1" />
              선택됨
            </>
          ) : (
            "이걸 먹을래"
          )}
        </Button>
      </div>
    </Card>
  )
}
