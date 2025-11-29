"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, BookOpen } from "lucide-react"

interface DiaryStatsProps {
  collected: number
  total: number
}

export default function DiaryStats({ collected, total }: DiaryStatsProps) {
  const percentage = Math.round((collected / total) * 100)

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* 수집 진행도 */}
      <Card className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={20} className="text-primary" />
          <p className="font-semibold text-foreground">수집 현황</p>
        </div>
        <p className="text-2xl font-bold text-primary mb-2">
          {collected}/{total}
        </p>
        <Progress value={percentage} className="h-2" indicatorClassName="bg-gradient-to-r from-primary to-accent" />
        <p className="text-xs text-muted-foreground mt-2">{percentage}% 완성</p>
      </Card>

      {/* 통계 */}
      <Card className="p-4 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={20} className="text-yellow-600" />
          <p className="font-semibold text-foreground">도감 레벨</p>
        </div>
        <p className="text-2xl font-bold text-yellow-600 mb-2">Lv. {Math.floor(collected / 3) + 1}</p>
        <p className="text-xs text-yellow-700">다음 레벨까지 {collected % 3 === 0 ? 3 : 3 - (collected % 3)}개</p>
      </Card>
    </div>
  )
}
