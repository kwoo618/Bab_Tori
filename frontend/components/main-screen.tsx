"use client"

import { useState, useEffect } from "react"
import CharacterDisplay from "@/components/character-display"
import CharacterStats from "@/components/character-stats"
import MainAction from "@/components/main-action"
import WeatherDisplay from "@/components/weather-display"
import { Card } from "@/components/ui/card"

interface MainScreenProps {
  onRecommend: () => void
}

export default function MainScreen({ onRecommend }: MainScreenProps) {
  const [character, setCharacter] = useState({
    name: "밥토리",
    level: 1,
    satiety: 75,
    friendship: 50,
    exp: 0,
    nextLevelExp: 100,
  })

  const [weather, setWeather] = useState({
    temp: 22,
    condition: "cloudy",
    humidity: 60,
    windSpeed: 5,
  })

  useEffect(() => {
    // 시뮬레이션: 시간에 따라 포만감 감소
    const interval = setInterval(() => {
      setCharacter((prev) => ({
        ...prev,
        satiety: Math.max(0, prev.satiety - 0.5),
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6 pt-6">
      {/* 헤더 */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-primary">밥토리</h1>
        <p className="text-muted-foreground">당신의 음식 친구</p>
      </div>

      {/* 날씨 정보 */}
      <WeatherDisplay weather={weather} />

      {/* 캐릭터 표시 */}
      <Card className="p-8 bg-gradient-to-b from-primary/10 to-secondary/10 border-2 border-primary/20 rounded-3xl">
        <CharacterDisplay character={character} />
      </Card>

      {/* 캐릭터 상태 */}
      <CharacterStats character={character} />

      {/* 메인 액션 버튼 */}
      <MainAction onRecommend={onRecommend} />
    </div>
  )
}
