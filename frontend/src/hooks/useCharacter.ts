"use client"

import { useState, useEffect } from "react"
import type { Character } from "../types"

export function useCharacter() {
  const [character, setCharacter] = useState<Character>({
    id: "1",
    level: 1,
    satiety: 80,
    friendship: 50,
    exp: 0,
    nextLevelExp: 100,
  })

  // 시간 경과에 따른 포만감 감소 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      setCharacter((prev) => ({
        ...prev,
        satiety: Math.max(0, prev.satiety - 2),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const updateSatiety = (amount: number) => {
    setCharacter((prev) => ({
      ...prev,
      satiety: Math.min(100, Math.max(0, prev.satiety + amount)),
    }))
  }

  const updateStats = (satiety: number, friendship: number, exp: number) => {
    setCharacter((prev) => {
      const newExp = prev.exp + exp
      const leveledUp = newExp >= prev.nextLevelExp

      return {
        ...prev,
        satiety: Math.min(100, Math.max(0, prev.satiety + satiety)),
        friendship: Math.min(100, Math.max(0, prev.friendship + friendship)),
        exp: leveledUp ? newExp - prev.nextLevelExp : newExp,
        level: leveledUp ? prev.level + 1 : prev.level,
        nextLevelExp: leveledUp ? prev.nextLevelExp + 50 : prev.nextLevelExp,
      }
    })
  }

  return { character, updateSatiety, updateStats }
}
