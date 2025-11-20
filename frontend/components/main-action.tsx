"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw, Utensils } from "lucide-react"

interface MainActionProps {
  onRecommend: () => void
}

export default function MainAction({ onRecommend }: MainActionProps) {
  return (
    <div className="space-y-3">
      <Button
        onClick={onRecommend}
        className="w-full h-14 text-lg font-bold rounded-2xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg"
      >
        <Utensils className="mr-2" size={24} />
        음식 추천받기
      </Button>
      <Button
        variant="outline"
        className="w-full h-12 font-semibold rounded-xl border-2 border-primary/30 text-primary hover:bg-primary/5 bg-transparent"
      >
        <RefreshCw size={20} className="mr-2" />
        새로고침
      </Button>
    </div>
  )
}
