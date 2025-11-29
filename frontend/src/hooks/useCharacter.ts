"use client"

import { useEffect, useState } from "react"
import { api } from "../lib/api"
import type { Character } from "../types"

// 백엔드 /character/state 가 그대로 돌려주는 형태
interface CharacterApiResponse {
  id: number
  user_id: string
  satiety: number
  friendship: number
  exp: number
  level: number
  last_meal_time: string | null
  last_update_time: string | null
  created_at: string | null
  updated_at: string | null
}

export function useCharacter(userId: string = "default_user") {
  const [character, setCharacter] = useState<Character | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 1) 최초 진입 시 상태 불러오기
  useEffect(() => {
    async function fetchCharacter() {
      try {
        setLoading(true)
        setError(null)

        const data = await api.get<CharacterApiResponse>(
          `/character/state?user_id=${userId}`,
        )

        const mapped: Character = {
          id: String(data.id),
          level: data.level,
          satiety: data.satiety,
          friendship: data.friendship,
          exp: data.exp,
          nextLevelExp: data.level * 100, // 레벨당 100 경험치 필요
        }

        setCharacter(mapped)
      } catch (e) {
        console.error(e)
        setError("밥토리 정보를 불러올 수 없어요")
      } finally {
        setLoading(false)
      }
    }

    fetchCharacter()
  }, [userId])

  // 2) 상태 업데이트 (/character/update 는 POST + query 방식)
  async function updateCharacter(opts: {
    satiety?: number
    friendship?: number
    expGain?: number
  }) {
    const params = new URLSearchParams()
    params.set("user_id", userId)
    if (typeof opts.satiety === "number") {
      params.set("satiety", String(opts.satiety))
    }
    if (typeof opts.friendship === "number") {
      params.set("friendship", String(opts.friendship))
    }
    if (typeof opts.expGain === "number") {
      params.set("exp_gain", String(opts.expGain))
    }

    try {
      const res = await api.postJson<{
        message: string
        character: CharacterApiResponse
        level_up: boolean
      }>(`/character/update?${params.toString()}`, {})

      const c = res.character
      const mapped: Character = {
        id: String(c.id),
        level: c.level,
        satiety: c.satiety,
        friendship: c.friendship,
        exp: c.exp,
        nextLevelExp: c.level * 100,
      }
      setCharacter(mapped)
      return res
    } catch (e) {
      console.error(e)
    }
  }
  return { character, loading, error, updateCharacter }
}