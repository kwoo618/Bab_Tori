"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface CharacterStatsProps {
  character: {
    satiety: number
    friendship: number
    exp: number
    nextLevelExp: number
  }
}

export default function CharacterStats({ character }: CharacterStatsProps) {
  return (
    <Card className="p-6 space-y-5 border-2 border-primary/20">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-semibold text-foreground">포만감</label>
          <span className="text-sm font-bold text-primary">{Math.round(character.satiety)}%</span>
        </div>
        <Progress
          value={character.satiety}
          className="h-3"
          indicatorClassName="bg-gradient-to-r from-primary to-accent"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-semibold text-foreground">친밀도</label>
          <span className="text-sm font-bold text-secondary">{Math.round(character.friendship)}%</span>
        </div>
        <Progress
          value={character.friendship}
          className="h-3"
          indicatorClassName="bg-gradient-to-r from-secondary to-purple-400"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-semibold text-foreground">경험치</label>
          <span className="text-sm font-bold text-accent">
            {character.exp}/{character.nextLevelExp}
          </span>
        </div>
        <Progress
          value={(character.exp / character.nextLevelExp) * 100}
          className="h-3"
          indicatorClassName="bg-gradient-to-r from-accent to-orange-400"
        />
      </div>
    </Card>
  )
}
