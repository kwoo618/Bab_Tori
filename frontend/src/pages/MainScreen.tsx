"use client"

import { useEffect, useState } from "react"
import { useCharacter } from "../hooks/useCharacter"
import { useWeather } from "../hooks/useWeather"
import CharacterDisplay from "../components/CharacterDisplay"
import CharacterStats from "../components/CharacterStats"
import WeatherDisplay from "../components/WeatherDisplay"
import { ChevronRight } from "lucide-react"

interface MainScreenProps {
  onRecommend: () => void
}

export default function MainScreen({ onRecommend }: MainScreenProps) {
  const { character } = useCharacter()
  const weather = useWeather()
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) {
      setGreeting("좋은 아침이야! 뭐 먹을래?")
    } else if (hour < 18) {
      setGreeting("점심 시간이야. 뭘 먹을까?")
    } else {
      setGreeting("저녁이야. 뭐 먹고 싶어?")
    }
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 pb-6">
      {/* 헤더 */}
      <div className="text-center pt-6">
        <h1 className="text-4xl font-bold text-primary mb-2">밥토리</h1>
        <p className="text-muted-foreground">음식으로 나를 성장시켜요!</p>
      </div>

      {/* 캐릭터 디스플레이 */}
      <div className="bg-white rounded-2xl p-8 shadow-md text-center">
        <CharacterDisplay level={character.level} satiety={character.satiety} />
      </div>

      {/* 상태 정보 */}
      <div className="bg-white rounded-2xl p-6 shadow-md space-y-4">
        <h2 className="text-xl font-bold text-foreground">밥토리의 상태</h2>
        <CharacterStats character={character} />
      </div>

      {/* 날씨 정보 */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h2 className="text-xl font-bold text-foreground mb-4">오늘 날씨</h2>
        <WeatherDisplay weather={weather} />
      </div>

      {/* 추천 버튼 */}
      <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-6 text-white shadow-lg">
        <p className="text-center text-lg font-semibold mb-4">{greeting}</p>
        <button
          onClick={onRecommend}
          className="w-full bg-white text-primary font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
        >
          음식 추천받기
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}
