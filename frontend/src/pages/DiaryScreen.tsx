"use client"

import { useState } from "react"
import { useFoodRecords } from "../hooks/useFoodRecords"
import { ChevronUp } from "lucide-react"

interface DiaryScreenProps {
  onBack: () => void
}

export default function DiaryScreen({ onBack }: DiaryScreenProps) {
  const { records, mockFoods } = useFoodRecords()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const categories = ["all", "한식", "일식", "중식", "양식"]

  const collectedFoods = new Set(records.map((r) => r.food.id))
  const filteredFoods =
    selectedCategory === "all" ? mockFoods : mockFoods.filter((f) => f.category === selectedCategory)

  const stats = {
    total: mockFoods.length,
    collected: collectedFoods.size,
  }

  return (
    <div className="max-w-2xl mx-auto p-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">음식 도감</h1>
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
          <ChevronUp size={24} />
        </button>
      </div>

      {/* 통계 */}
      <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-6 text-white shadow-md">
        <div className="text-center mb-4">
          <p className="text-sm opacity-90">수집 진행도</p>
          <p className="text-4xl font-bold">
            {stats.collected}/{stats.total}
          </p>
        </div>
        <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
          <div
            className="bg-white h-full transition-all duration-500"
            style={{ width: `${(stats.collected / stats.total) * 100}%` }}
          />
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat ? "bg-primary text-white" : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            {cat === "all" ? "전체" : cat}
          </button>
        ))}
      </div>

      {/* 음식 그리드 */}
      <div className="grid grid-cols-3 gap-4">
        {filteredFoods.map((food) => {
          const isCollected = collectedFoods.has(food.id)
          const count = records.filter((r) => r.food.id === food.id).length

          return (
            <div
              key={food.id}
              className={`rounded-xl p-4 text-center transition-all ${
                isCollected ? "bg-white shadow-md" : "bg-muted/50 opacity-50"
              }`}
            >
              <div className={`text-4xl mb-2 transition-transform ${isCollected ? "scale-100" : "scale-50"}`}>
                {isCollected ? food.emoji : "?"}
              </div>
              <h3 className="font-semibold text-sm text-foreground mb-1">{isCollected ? food.name : "?"}</h3>
              {isCollected && <p className="text-xs text-muted-foreground">{count}회 수집</p>}
            </div>
          )
        })}
      </div>

      {/* 기록 목록 */}
      {records.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-lg font-bold text-foreground mb-4">최근 기록</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {records.slice(0, 10).map((record) => (
              <div key={record.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <span className="text-2xl">{record.food.emoji}</span>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{record.food.name}</p>
                  <p className="text-xs text-muted-foreground">{record.timestamp.toLocaleDateString()}</p>
                </div>
                {record.photoUrl && <span className="text-xs text-primary">📸</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
