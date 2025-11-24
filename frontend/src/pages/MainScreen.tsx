"use client"

import { useState } from "react"
import { useCharacter } from "../hooks/useCharacter"
import { useWeather } from "../hooks/useWeather"
import CharacterDisplay from "../components/CharacterDisplay"
import CharacterStats from "../components/CharacterStats"
import FoodInputModal, { type FoodInputData } from "../components/FoodInputModal"

interface MainScreenProps {
  onRecommend: () => void
}

export default function MainScreen({ onRecommend }: MainScreenProps) {
  const { character } = useCharacter()
  const weather = useWeather()
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false)

  const handleFoodSubmit = (data: FoodInputData) => {
    console.log("음식 정보:", data)
    setIsFoodModalOpen(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 pb-6">
      {/* 캐릭터 디스플레이 */}
      <div className="bg-white rounded-3xl p-8 shadow-sm text-center">
        <CharacterDisplay level={character.level} satiety={character.satiety} />
      </div>

      {/* EXP 게이지 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">EXP</span>
          <span className="text-sm font-bold text-gray-700">
            {character.exp} / {character.nextLevelExp}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-400 to-green-500 h-full transition-all duration-500"
            style={{ width: `${Math.min(100, (character.exp / character.nextLevelExp) * 100)}%` }}
          />
        </div>
      </div>

      {/* 상태 정보 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <CharacterStats character={character} />
      </div>

      {/* 날씨 정보 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">현재 위치: 서울시 강남구</span>
          <span className="text-sm font-medium text-gray-700">
            {weather.temp}°C / 습도 {weather.humidity}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-3xl">{weather.icon}</span>
          <span className="text-gray-600">{weather.description}</span>
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className="space-y-3">
        <button
          onClick={() => setIsFoodModalOpen(true)}
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-3 rounded-2xl font-bold shadow-md hover:shadow-lg transition-shadow active:scale-95"
        >
          음식 기록하기
        </button>

        <button
          onClick={onRecommend}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-2xl font-bold shadow-md hover:shadow-lg transition-shadow active:scale-95"
        >
          나의 음식 도감
        </button>
      </div>

      <FoodInputModal isOpen={isFoodModalOpen} onClose={() => setIsFoodModalOpen(false)} onSubmit={handleFoodSubmit} />
    </div>
  )
}
