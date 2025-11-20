const CHARACTERS = {
  1: "🥚",
  2: "🐣",
  3: "🐥",
  4: "🐔",
  5: "🦅",
  6: "🦉",
  7: "🦜",
  8: "🦚",
  9: "👑",
  10: "⭐",
}

interface CharacterDisplayProps {
  level: number
  satiety: number
}

export default function CharacterDisplay({ level, satiety }: CharacterDisplayProps) {
  const emoji = CHARACTERS[Math.min(level, 10) as keyof typeof CHARACTERS] || "🐔"

  // 포만감에 따른 표정 표현
  const getExpression = () => {
    if (satiety > 70) return "😊"
    if (satiety > 40) return "🙂"
    if (satiety > 20) return "😐"
    return "😢"
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-8xl character-animation">{emoji}</div>
      <div className="text-6xl">{getExpression()}</div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-1">Lv. {level}</h2>
        <p className="text-muted-foreground">밥토리</p>
      </div>
    </div>
  )
}
