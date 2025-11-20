import type { Character } from "../types"

interface CharacterStatsProps {
  character: Character
}

export default function CharacterStats({ character }: CharacterStatsProps) {
  const stats = [
    { label: "포만감", value: character.satiety, color: "bg-orange-400" },
    { label: "친밀도", value: character.friendship, color: "bg-purple-400" },
    { label: "경험치", value: Math.floor((character.exp / character.nextLevelExp) * 100), color: "bg-green-400" },
  ]

  return (
    <div className="space-y-4">
      {stats.map((stat) => (
        <div key={stat.label}>
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium text-foreground">{stat.label}</span>
            <span className="text-sm text-muted-foreground">{stat.value}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className={`${stat.color} h-full transition-all duration-500`}
              style={{ width: `${Math.min(100, stat.value)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
