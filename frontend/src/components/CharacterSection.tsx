"use client"

import type React from "react"

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

export default function CharacterSection({ status, message, emoji, onOpenCollection }: CharacterSectionProps) {
  return (
    <section id="character-section" className="flex flex-col items-center pt-8">
      {/* Character */}
      <div className="relative w-full text-center mb-4">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-sky-100 text-sky-700 px-4 py-2 rounded-full shadow-md bap-tory-talk-bubble whitespace-nowrap z-10">
          <p>{message}</p>
        </div>
        <div className="w-40 h-40 mx-auto bg-gradient-to-br from-amber-300 to-orange-400 rounded-full flex items-center justify-center shadow-inner mt-4 character-animation">
          <span className={`text-7xl transition-transform duration-500 ${emoji === "🥰" ? "scale-125" : ""}`}>
            {emoji}
          </span>
        </div>
        <h2 className="text-2xl font-bold mt-4">밥토리 (Lv. 5)</h2>
        <div className="w-full bg-gray-200 rounded-full h-4 mt-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-1000"
            style={{ width: "45%" }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">EXP: 450 / 1000</p>
      </div>

      {/* Status Bars */}
      <div className="w-full space-y-3 mt-4">
        <StatusItem
          label="배고픔"
          icon={<UtensilsCrossed className="w-4 h-4 mr-1" />}
          value={status.hunger}
          color="bg-red-500"
        />
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
        <StatusItem
          label="친밀도"
          icon={<Heart className="w-4 h-4 mr-1" />}
          value={status.friendship}
          color="bg-pink-400"
        />
      </div>

      <button
        onClick={onOpenCollection}
        className="mt-6 w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200 hover:scale-105 flex items-center justify-center shadow-md"
      >
        <BookOpen className="w-5 h-5 mr-2" />
        나의 음식 도감
      </button>
    </section>
  )
}

function StatusItem({
  label,
  icon,
  value,
  color,
}: { label: string; icon: React.ReactNode; value: number; color: string }) {
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
