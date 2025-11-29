"use client"

import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

interface Entry {
  id: string
  foodName: string
  emoji: string
  category: string
  date: string
  count: number
  isCollected: boolean
}

interface DiaryEntryProps {
  entry: Entry
}

export default function DiaryEntry({ entry }: DiaryEntryProps) {
  return (
    <Card
      className={`p-4 rounded-2xl text-center space-y-3 transition-all cursor-pointer hover:shadow-lg hover:scale-105 ${
        entry.isCollected
          ? "bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/30"
          : "bg-gray-100 border-2 border-gray-300 opacity-50"
      }`}
    >
      {/* 음식 이모지 */}
      <div className="text-5xl">{entry.isCollected ? entry.emoji : "❓"}</div>

      {/* 음식명 */}
      <div>
        <h3 className={`text-lg font-bold ${entry.isCollected ? "text-foreground" : "text-gray-400"}`}>
          {entry.isCollected ? entry.foodName : "?"}
        </h3>
        <p className="text-xs text-muted-foreground">{entry.category}</p>
      </div>

      {/* 수집 정보 */}
      {entry.isCollected && (
        <div className="pt-2 border-t border-primary/20">
          <div className="flex items-center justify-center gap-1">
            <Star size={14} fill="currentColor" className="text-yellow-500" />
            <span className="text-sm font-semibold text-yellow-600">{entry.count}회 수집</span>
          </div>
          <p className="text-xs text-muted-foreground">{entry.date}</p>
        </div>
      )}
    </Card>
  )
}
