export default function Header() {
  return (
    <header className="text-center p-4 border-b bg-white z-10 flex-shrink-0">
      <h1 className="text-3xl font-bold text-sky-600 flex items-center justify-center gap-2">
        <span>🍚</span> 밥토리 <span>🍚</span>
      </h1>
      <p className="text-gray-500 text-sm mt-1">날씨와 기분에 딱 맞는 음식을 추천해드려요!</p>
    </header>
  )
}
