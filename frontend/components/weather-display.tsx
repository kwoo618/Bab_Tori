"use client"

import { Cloud, CloudRain, Sun, Wind } from "lucide-react"
import { Card } from "@/components/ui/card"

interface WeatherDisplayProps {
  weather: {
    temp: number
    condition: string
    humidity: number
    windSpeed: number
  }
}

export default function WeatherDisplay({ weather }: WeatherDisplayProps) {
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun size={32} className="text-yellow-400" />
      case "rainy":
        return <CloudRain size={32} className="text-blue-400" />
      default:
        return <Cloud size={32} className="text-gray-400" />
    }
  }

  return (
    <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 rounded-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getWeatherIcon(weather.condition)}
          <div>
            <p className="text-2xl font-bold text-blue-900">{weather.temp}°C</p>
            <p className="text-sm text-blue-700 capitalize">{weather.condition}</p>
          </div>
        </div>
        <div className="text-right text-sm text-blue-800">
          <p className="flex items-center gap-1">💧 {weather.humidity}%</p>
          <p className="flex items-center gap-1">
            <Wind size={16} /> {weather.windSpeed}m/s
          </p>
        </div>
      </div>
    </Card>
  )
}
