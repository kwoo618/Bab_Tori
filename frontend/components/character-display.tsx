"use client"

interface CharacterDisplayProps {
  character: {
    name: string
    level: number
  }
}

export default function CharacterDisplay({ character }: CharacterDisplayProps) {
  // 레벨에 따른 캐릭터 표현 (이모지 사용)
  const characterEmojis: Record<number, string> = {
    1: "🐥",
    2: "🐤",
    3: "🐓",
    4: "🦉",
    5: "🦆",
    6: "🦅",
    7: "🦚",
    8: "🦜",
    9: "🦩",
    10: "✨🐉✨",
  }

  const emoji = characterEmojis[character.level] || "🐥"
  const displayEmoji = emoji.includes("🐉") ? emoji : emoji

  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <div className="text-8xl animate-bounce" style={{ animationDuration: "2s" }}>
        {displayEmoji}
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">{character.name}</h2>
        <p className="text-lg text-primary font-semibold">Lv. {character.level}</p>
      </div>
    </div>
  )
}
