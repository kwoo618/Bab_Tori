"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import DiaryEntryComponent from "@/components/diary-entry"
import DiaryStatsComponent from "@/components/diary-stats"

interface DiaryEntry {
  id: string
  foodName: string
  emoji: string
  category: string
  date: string
  count: number
  isCollected: boolean
}

interface DiaryScreenProps {
  onBack: () => void
}

const DIARY_ENTRIES: DiaryEntry[] = [
  { id: "1", foodName: "불고기", emoji: "🍖", category: "한식", date: "2024-01-15", count: 3, isCollected: true },
  { id: "2", foodName: "라면", emoji: "🍜", category: "분식", date: "2024-01-14", count: 5, isCollected: true },
  { id: "3", foodName: "김밥", emoji: "🍣", category: "한식", date: "2024-01-13", count: 2, isCollected: true },
  { id: "4", foodName: "피자", emoji: "🍕", category: "양식", date: "2024-01-12", count: 1, isCollected: true },
  { id: "5", foodName: "우동", emoji: "🍜", category: "일식", date: "2024-01-11", count: 1, isCollected: true },
  { id: "6", foodName: "갈비탕", emoji: "🍲", category: "한식", date: "2024-01-10", count: 2, isCollected: true },
  { id: "7", foodName: "햄버거", emoji: "🍔", category: "양식", date: "2024-01-09", count: 1, isCollected: false },
  { id: "8", foodName: "교자", emoji: "🥟", category: "일식", date: "2024-01-08", count: 1, isCollected: false },
]

export default function DiaryScreen({ onBack }: DiaryScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [expandedStats, setExpandedStats] = useState(true)

  const categories = ["all", "한식", "중식", "일식", "양식", "분식", "패스트푸드"]
  const filteredEntries =
    selectedCategory === "all" ? DIARY_ENTRIES : DIARY_ENTRIES.filter((entry) => entry.category === selectedCategory)

  const collectedCount = DIARY_ENTRIES.filter((e) => e.isCollected).length
  const totalCount = DIARY_ENTRIES.length

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6 pt-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition">
          <ArrowLeft size={24} className="text-foreground" />
        </button>
        <h1 className="text-2xl font-bold text-primary">음식 도감</h1>
        <div className="w-10" />
      </div>

      {/* 도감 통계 */}
      <DiaryStatsComponent collected={collectedCount} total={totalCount} />

      {/* 카테고리 필터 */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-foreground">카테고리 필터</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === category
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-foreground hover:bg-gray-200"
              }`}
            >
              {category === "all" ? "전체" : category}
            </button>
          ))}
        </div>
      </div>

      {/* 도감 엔트리 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {filteredEntries.map((entry) => (
          <DiaryEntryComponent key={entry.id} entry={entry} />
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <Card className="p-12 bg-gray-50 border-gray-200 rounded-2xl text-center">
          <p className="text-muted-foreground">이 카테고리에 수집한 음식이 없어요.</p>
        </Card>
      )}

      {/* 돌아가기 버튼 */}
      <Button
        onClick={onBack}
        variant="outline"
        className="w-full h-12 font-semibold rounded-xl border-2 border-primary/30 text-primary hover:bg-primary/5 bg-transparent"
      >
        홈으로
      </Button>
    </div>
  )
}
