import type { WeatherData } from "../types"

interface WeatherDisplayProps {
  weather: WeatherData
}

export default function WeatherDisplay({ weather }: WeatherDisplayProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-blue-50 rounded-lg p-4 text-center">
        <div className="text-3xl mb-2">{weather.icon}</div>
        <p className="text-2xl font-bold text-primary">{weather.temp}°</p>
        <p className="text-xs text-muted-foreground">{weather.description}</p>
      </div>
      <div className="bg-blue-50 rounded-lg p-4 text-center">
        <p className="text-sm text-muted-foreground mb-1">습도</p>
        <p className="text-2xl font-bold text-primary">{weather.humidity}%</p>
      </div>
      <div className="bg-blue-50 rounded-lg p-4 text-center">
        <p className="text-sm text-muted-foreground mb-1">풍속</p>
        <p className="text-2xl font-bold text-primary">{weather.windSpeed} m/s</p>
      </div>
    </div>
  )
}
