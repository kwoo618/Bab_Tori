"use client"

import type { Food } from "../types"

interface FoodCardProps {
  food: Food
  onSelect: (food: Food) => void
  isRecommended: boolean
}

export default function FoodCard({ food, onSelect, isRecommended }: FoodCardProps) {
  return (
    <button
      onClick={() => onSelect(food)}
      className={`p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
        isRecommended
          ? "bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-primary shadow-md hover:shadow-lg"
          : "bg-gray-50 border-2 border-muted shadow-sm hover:shadow-md"
      }`}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="text-5xl">{food.emoji}</div>
        <h3 className="font-bold text-lg text-foreground">{food.name}</h3>
        <p className="text-xs text-muted-foreground">{food.category}</p>
        {isRecommended && (
          <span className="text-xs font-semibold text-primary bg-orange-100 px-2 py-1 rounded-full">추천!</span>
        )}
      </div>
    </button>
  )
}
