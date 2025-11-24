import { UtensilsCrossed, Smile, Battery, Heart } from "lucide-react"
import type { Character } from "../types"

interface CharacterStatsProps {
  character: Character
}

export default function CharacterStats({ character }: CharacterStatsProps) {
  const stats = [
    {
      label: "배고픔",
      value: character.satiety,
      color: "bg-red-500",
      icon: <UtensilsCrossed className="w-4 h-4 mr-1" />,
    },
    { label: "행복도", value: character.friendship, color: "bg-yellow-400", icon: <Smile className="w-4 h-4 mr-1" /> },
    {
      label: "피로도",
      value: Math.min(100 - character.satiety, 100),
      color: "bg-indigo-500",
      icon: <Battery className="w-4 h-4 mr-1" />,
    },
    { label: "친밀도", value: character.friendship, color: "bg-pink-400", icon: <Heart className="w-4 h-4 mr-1" /> },
  ]

  return (
    <div className="w-full space-y-3 mt-4">
      {stats.map((stat) => (
        <div key={stat.label} className="status-item">
          <label className="flex justify-between items-center text-sm font-semibold mb-1">
            <span>{stat.label}</span>
            <span className="flex items-center text-gray-600">
              {stat.icon}
              <span>{Math.min(100, stat.value)}%</span>
            </span>
          </label>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`${stat.color} h-3 rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${Math.min(100, stat.value)}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  )
}
