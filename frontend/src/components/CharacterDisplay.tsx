interface CharacterDisplayProps {
  level: number
  satiety: number
  message?: string
  emoji?: string
}

export default function CharacterDisplay({
  level,
  satiety,
  message = "오늘 뭐 먹을지 고민이야?",
  emoji = "😋",
}: CharacterDisplayProps) {
  return (
    <div className="relative w-full text-center mb-4">
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-sky-100 text-sky-700 px-4 py-2 rounded-full shadow-md bap-tory-talk-bubble whitespace-nowrap z-10">
        <p className="text-sm">{message}</p>
      </div>
      <div className="w-40 h-40 mx-auto bg-gradient-to-br from-amber-300 to-orange-400 rounded-full flex items-center justify-center shadow-inner mt-4 character-animation">
        <span className={`text-7xl transition-transform duration-500 ${emoji === "🥰" ? "scale-125" : ""}`}>
          {emoji}
        </span>
      </div>
      <h2 className="text-2xl font-bold mt-4">밥토리 (Lv. {level})</h2>
      <div className="w-full bg-gray-200 rounded-full h-4 mt-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-1000"
          style={{ width: "45%" }}
        ></div>
      </div>
      <p className="text-sm text-gray-500 mt-1">EXP: 450 / 1000</p>
    </div>
  )
}
