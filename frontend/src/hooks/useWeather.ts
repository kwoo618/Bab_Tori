"use client"

import { useState, useEffect } from "react"
import type { WeatherData } from "../types"

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData>({
    temp: 22,
    humidity: 65,
    windSpeed: 3.5,
    description: "맑음",
    icon: "☀️",
  })

  // 실제 API를 사용하려면 OpenWeatherMap API 키 필요
  useEffect(() => {
    // 데모 데이터
    const mockWeather: WeatherData = {
      temp: 22,
      humidity: 65,
      windSpeed: 3.5,
      description: "맑음",
      icon: "☀️",
    }
    setWeather(mockWeather)
  }, [])

  return weather
}
