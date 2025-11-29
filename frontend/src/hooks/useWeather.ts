"use client"

import { useState, useEffect } from "react"
import type { WeatherData } from "../types"
import { useGeolocation } from "./useGeolocation"
import { api } from "../lib/api"

interface WeatherApiResponse {
  location: string
  temperature: number
  condition: string
  description: string
  humidity: number
  // feels_like 등은 지금 안 써서 생략
}

export function useWeather() {
  const { location, loading: locationLoading, error: locationError } = useGeolocation()
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (locationLoading) return // 위치 정보 로딩 중이면 대기

    if (locationError || !location) {
      setError(locationError || "위치 정보를 가져올 수 없어 날씨를 조회할 수 없습니다.")
      setLoading(false)
      return
    }

    async function fetchWeather() {
      try {
        setLoading(true)
        setError(null)

        // FastAPI /weather 에 현재 위치 전달
        const data = await api.get<WeatherApiResponse>(`/weather?lat=${location.lat}&lon=${location.lon}`)

        // 날씨 상태에 따라 이모지 매핑
        let icon = "☀️"
        switch (data.condition) {
          case "Rain":
            icon = "🌧️"
            break
          case "Clouds":
            icon = "☁️"
            break
          case "Snow":
            icon = "❄️"
            break
          default:
            icon = "☀️"
        }

        const mapped: WeatherData = {
          location: data.location,
          temp: data.temperature,
          humidity: data.humidity,
          windSpeed: 0, // 백엔드에서 풍속은 안 주니까 일단 0으로
          description: data.description,
          icon,
        }

        setWeather(mapped)
      } catch (err) {
        console.error(err)
        setError("날씨 정보를 불러오지 못했어요.")
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [location, locationLoading, locationError])

  return { weather, loading: loading || locationLoading, error }
}
