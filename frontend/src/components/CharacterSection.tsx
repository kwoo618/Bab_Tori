"use client"

import type React from "react"
import { useCharacter } from "../hooks/useCharacter"
import { UtensilsCrossed, Smile, Battery, Heart, BookOpen } from "lucide-react"

interface CharacterSectionProps {
  status: {
    hunger: number
    happiness: number
    fatigue: number
    friendship: number
  }
  message: string
  emoji: string
  onOpenCollection: () => void
}

export default function CharacterSection({status,message,emoji,onOpenCollection,}: CharacterSectionProps) {
  const { character, loading, error, updateCharacter } = useCharacter()

  // ✅ 1) 캐릭터 레벨/EXP 표시용 텍스트 & 퍼센트 계산
  const levelLabel = loading
    ? "밥토리 불러오는 중..."
    : error
    ? "밥토리 정보를 불러올 수 없어요"
    : character
    ? `밥토리 (Lv. ${character.level})`
    : "밥토리"

  const expPercent =
    character && character.nextLevelExp > 0
      ? Math.min(100, (character.exp / character.nextLevelExp) * 100)
      : 0

  const expLabel = character
    ? `EXP: ${character.exp} / ${character.nextLevelExp}`
    : "EXP: -"

  // ✅ 2) 상태바 값: 백엔드 값이 있으면 그걸 우선 사용
  //    - 배고픔: 포만감(satiety)의 반대값으로 예시 처리 (100 - satiety)
  const hungerValue =
    character != null
      ? Math.max(0, Math.min(100, 100 - character.satiety))
      : status.hunger

  const friendshipValue =
    character != null ? character.friendship : status.friendship

  return (
    <section id="character-section" className="flex flex-col items-center pt-8">
      {/* Character */}
      <div className="relative w-full text-center mb-4">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-sky-100 text-sky-700 px-4 py-2 rounded-full shadow-md bap-tory-talk-bubble whitespace-nowrap z-10">
          <p>{message}</p>
        </div>
        <div className="w-full flex items-center justify-center mt-4">
          <img
            src="/cat/catpt.png"
            alt="밥토리 캐릭터"
            className="w-32 h-32 object-contain drop-shadow-md character-animation"
          />
        </div>

        {/* ✅ 3) Lv/EXP 부분을 백엔드 값 기반으로 변경 */}
        <h2 className="text-2xl font-bold mt-4">{levelLabel}</h2>

        <div className="w-full bg-gray-200 rounded-full h-4 mt-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-1000"
            style={{ width: `${expPercent}%` }} // 🔁 45% → expPercent
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">{expLabel}</p>
      </div>

      {/* Status Bars */}
      <div className="w-full space-y-3 mt-4">
        {/* ✅ 배고픔: hungerValue 사용 (백엔드 값 있으면 그걸 우선) */}
        <StatusItem
          label="배고픔"
          icon={<UtensilsCrossed className="w-4 h-4 mr-1" />}
          value={hungerValue}
          color="bg-red-500"
        />
        {/* 행복도, 피로도는 아직 props 값 그대로 사용 */}
        <StatusItem
          label="행복도"
          icon={<Smile className="w-4 h-4 mr-1" />}
          value={status.happiness}
          color="bg-yellow-400"
        />
        <StatusItem
          label="피로도"
          icon={<Battery className="w-4 h-4 mr-1" />}
          value={status.fatigue}
          color="bg-indigo-500"
        />
        {/* ✅ 친밀도: friendshipValue 사용 */}
        <StatusItem
          label="친밀도"
          icon={<Heart className="w-4 h-4 mr-1" />}
          value={friendshipValue}
          color="bg-pink-400"
        />
      </div>
    </section>
  )
}

function StatusItem({label,icon,value,color,}: {
  label: string
  icon: React.ReactNode
  value: number
  color: string
}) {
  return (
    <div className="status-item">
      <label className="flex justify-between items-center text-sm font-semibold mb-1">
        <span>{label}</span>
        <span className="flex items-center text-gray-600">
          {icon}
          <span>{value}%</span>
        </span>
      </label>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`${color} h-3 rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  )
}
