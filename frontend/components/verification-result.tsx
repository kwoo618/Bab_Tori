"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface VerificationResultProps {
  verification: {
    success: boolean
    foodName: string
    confidence: number
  }
  onConfirm: () => void
}

export default function VerificationResult({ verification, onConfirm }: VerificationResultProps) {
  const getFoodEmoji = (foodName: string): string => {
    const emojiMap: Record<string, string> = {
      불고기: "🍖",
      라면: "🍜",
      김밥: "🍣",
      피자: "🍕",
      햄버거: "🍔",
      우동: "🍜",
    }
    return emojiMap[foodName] || "🍽️"
  }

  return (
    <div className="space-y-6">
      {/* 성공 메시지 */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-200 rounded-full">
            <Check size={24} className="text-green-700" />
          </div>
          <p className="text-lg font-bold text-green-900">음식 인증 완료!</p>
        </div>
        <p className="text-green-800">도감에 추가되었습니다.</p>
      </Card>

      {/* 인식된 음식 정보 */}
      <Card className="p-6 rounded-2xl border-2 border-primary/20 space-y-4">
        <div className="text-center">
          <div className="text-6xl mb-4">{getFoodEmoji(verification.foodName)}</div>
          <h3 className="text-2xl font-bold text-foreground">{verification.foodName}</h3>
        </div>

        {/* 신뢰도 */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">인식 신뢰도</p>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-500"
              style={{ width: `${verification.confidence}%` }}
            />
          </div>
          <p className="text-sm font-semibold text-primary text-right">{verification.confidence}%</p>
        </div>
      </Card>

      {/* 리워드 정보 */}
      <Card className="p-4 bg-yellow-50 border-yellow-200 rounded-2xl space-y-3">
        <p className="font-semibold text-yellow-900">오늘의 보상</p>
        <div className="space-y-2 text-sm text-yellow-800">
          <p className="flex items-center gap-2">🔥 포만감 +40</p>
          <p className="flex items-center gap-2">💗 친밀도 +10</p>
          <p className="flex items-center gap-2">⭐ 경험치 +20</p>
        </div>
      </Card>

      {/* 확인 버튼 */}
      <Button
        onClick={onConfirm}
        className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white rounded-xl font-semibold"
      >
        완료
      </Button>
    </div>
  )
}
